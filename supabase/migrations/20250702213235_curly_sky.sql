/*
  # Add Customer Notes to Cart Items and Order Items

  1. New Fields
    - `customer_note` - Text field for customer-specific notes about each product

  2. Updates
    - Add customer_note field to cart_items table
    - Add customer_note field to order_items table
    - Update cart management functions to handle notes
*/

-- Add customer_note field to cart_items if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cart_items' AND column_name = 'customer_note'
  ) THEN
    ALTER TABLE cart_items ADD COLUMN customer_note text;
  END IF;
END $$;

-- Add customer_note field to order_items if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'customer_note'
  ) THEN
    ALTER TABLE order_items ADD COLUMN customer_note text;
  END IF;
END $$;

-- Update add_to_cart function to include customer_note
CREATE OR REPLACE FUNCTION add_to_cart(
  p_product_id text,
  p_product_name text,
  p_unit_price numeric,
  p_quantity integer DEFAULT 1,
  p_selected_color text DEFAULT NULL,
  p_selected_size text DEFAULT NULL,
  p_size_dimensions text DEFAULT NULL,
  p_customer_note text DEFAULT NULL
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
    -- Update quantity and note
    UPDATE cart_items
    SET quantity = quantity + p_quantity,
        customer_note = CASE 
                          WHEN p_customer_note IS NOT NULL AND p_customer_note <> '' 
                          THEN p_customer_note 
                          ELSE customer_note 
                        END,
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
      size_dimensions,
      customer_note
    )
    VALUES (
      auth.uid(), 
      p_product_id, 
      p_product_name, 
      p_unit_price, 
      p_quantity, 
      p_selected_color, 
      p_selected_size, 
      p_size_dimensions,
      p_customer_note
    )
    RETURNING * INTO result_item;
  END IF;

  RETURN json_build_object(
    'success', true,
    'item', row_to_json(result_item)
  );
END;
$$;

-- Update create_order_from_cart function to include customer_note
CREATE OR REPLACE FUNCTION create_order_from_cart(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text DEFAULT NULL,
  p_shipping_address jsonb DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cart_total numeric;
  new_order_id uuid;
  cart_item RECORD;
BEGIN
  -- Calculate cart total
  SELECT get_cart_total() INTO cart_total;
  
  IF cart_total = 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Cart is empty'
    );
  END IF;

  -- Create order
  INSERT INTO orders (
    user_id,
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    total_amount,
    currency,
    payment_status,
    order_status
  )
  VALUES (
    auth.uid(),
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_shipping_address,
    cart_total,
    'eur',
    'pending',
    'processing'
  )
  RETURNING id INTO new_order_id;

  -- Copy cart items to order items
  FOR cart_item IN
    SELECT * FROM cart_items WHERE user_id = auth.uid()
  LOOP
    INSERT INTO order_items (
      order_id,
      product_id,
      product_name,
      quantity,
      unit_price,
      selected_color,
      selected_size,
      size_dimensions,
      customer_note
    )
    VALUES (
      new_order_id,
      cart_item.product_id,
      cart_item.product_name,
      cart_item.quantity,
      cart_item.unit_price,
      cart_item.selected_color,
      cart_item.selected_size,
      cart_item.size_dimensions,
      cart_item.customer_note
    );
  END LOOP;

  -- Clear cart
  DELETE FROM cart_items WHERE user_id = auth.uid();

  RETURN json_build_object(
    'success', true,
    'order_id', new_order_id,
    'total_amount', cart_total
  );
END;
$$;