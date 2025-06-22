/*
  # Add Size Fields to Cart Items and Order Items

  1. New Fields
    - `selected_size` - Size name (Small, Medium, Large)
    - `size_dimensions` - Dimensions for the selected size

  2. Updates
    - Add fields to cart_items table
    - Add fields to order_items table
    - Update cart management functions
*/

-- Add size fields to cart_items if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cart_items' AND column_name = 'selected_size'
  ) THEN
    ALTER TABLE cart_items ADD COLUMN selected_size text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cart_items' AND column_name = 'size_dimensions'
  ) THEN
    ALTER TABLE cart_items ADD COLUMN size_dimensions text;
  END IF;
END $$;

-- Add size fields to order_items if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'selected_size'
  ) THEN
    ALTER TABLE order_items ADD COLUMN selected_size text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'size_dimensions'
  ) THEN
    ALTER TABLE order_items ADD COLUMN size_dimensions text;
  END IF;
END $$;

-- Update cart management functions
CREATE OR REPLACE FUNCTION add_to_cart(
  p_product_id text,
  p_product_name text,
  p_unit_price numeric,
  p_quantity integer DEFAULT 1,
  p_selected_color text DEFAULT NULL,
  p_selected_size text DEFAULT NULL,
  p_size_dimensions text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existing_item cart_items%ROWTYPE;
  result_item cart_items%ROWTYPE;
BEGIN
  -- Check if item already exists in cart with same color and size
  SELECT * INTO existing_item
  FROM cart_items
  WHERE user_id = auth.uid()
    AND product_id = p_product_id
    AND (selected_color IS NOT DISTINCT FROM p_selected_color)
    AND (selected_size IS NOT DISTINCT FROM p_selected_size);

  IF existing_item.id IS NOT NULL THEN
    -- Update quantity
    UPDATE cart_items
    SET quantity = quantity + p_quantity,
        updated_at = now()
    WHERE id = existing_item.id
    RETURNING * INTO result_item;
  ELSE
    -- Insert new item
    INSERT INTO cart_items (
      user_id, 
      product_id, 
      product_name, 
      unit_price, 
      quantity, 
      selected_color, 
      selected_size, 
      size_dimensions
    )
    VALUES (
      auth.uid(), 
      p_product_id, 
      p_product_name, 
      p_unit_price, 
      p_quantity, 
      p_selected_color, 
      p_selected_size, 
      p_size_dimensions
    )
    RETURNING * INTO result_item;
  END IF;

  RETURN json_build_object(
    'success', true,
    'item', row_to_json(result_item)
  );
END;
$$;