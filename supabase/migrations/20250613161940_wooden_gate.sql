/*
  # User Cart and Enhanced Order System

  1. New Tables
    - `user_profiles` - Extended user information
    - `cart_items` - User shopping cart items
    - Enhanced `orders` and `order_items` tables

  2. Security
    - Enable RLS on all tables
    - User-specific policies for cart and orders
    - Secure user profile management

  3. Functions
    - Cart management functions
    - Order creation from cart
*/

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name text,
  phone text,
  address text,
  city text,
  postal_code text,
  country text DEFAULT 'IT',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  selected_color text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id, selected_color)
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Cart items policies
CREATE POLICY "Users can view own cart items"
  ON cart_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin policies for cart items
CREATE POLICY "Admin users can read all cart items"
  ON cart_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Cart management functions
CREATE OR REPLACE FUNCTION add_to_cart(
  p_product_id text,
  p_product_name text,
  p_unit_price numeric,
  p_quantity integer DEFAULT 1,
  p_selected_color text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existing_item cart_items%ROWTYPE;
  result_item cart_items%ROWTYPE;
BEGIN
  -- Check if item already exists in cart
  SELECT * INTO existing_item
  FROM cart_items
  WHERE user_id = auth.uid()
    AND product_id = p_product_id
    AND (selected_color = p_selected_color OR (selected_color IS NULL AND p_selected_color IS NULL));

  IF existing_item.id IS NOT NULL THEN
    -- Update quantity
    UPDATE cart_items
    SET quantity = quantity + p_quantity,
        updated_at = now()
    WHERE id = existing_item.id
    RETURNING * INTO result_item;
  ELSE
    -- Insert new item
    INSERT INTO cart_items (user_id, product_id, product_name, unit_price, quantity, selected_color)
    VALUES (auth.uid(), p_product_id, p_product_name, p_unit_price, p_quantity, p_selected_color)
    RETURNING * INTO result_item;
  END IF;

  RETURN json_build_object(
    'success', true,
    'item', row_to_json(result_item)
  );
END;
$$;

CREATE OR REPLACE FUNCTION update_cart_item_quantity(
  p_cart_item_id uuid,
  p_quantity integer
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_item cart_items%ROWTYPE;
BEGIN
  IF p_quantity <= 0 THEN
    DELETE FROM cart_items
    WHERE id = p_cart_item_id AND user_id = auth.uid();
    
    RETURN json_build_object(
      'success', true,
      'deleted', true
    );
  ELSE
    UPDATE cart_items
    SET quantity = p_quantity,
        updated_at = now()
    WHERE id = p_cart_item_id AND user_id = auth.uid()
    RETURNING * INTO result_item;

    RETURN json_build_object(
      'success', true,
      'item', row_to_json(result_item)
    );
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION clear_user_cart()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM cart_items WHERE user_id = auth.uid();
  
  RETURN json_build_object(
    'success', true,
    'message', 'Cart cleared successfully'
  );
END;
$$;

CREATE OR REPLACE FUNCTION get_cart_total()
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total numeric := 0;
BEGIN
  SELECT COALESCE(SUM(unit_price * quantity), 0)
  INTO total
  FROM cart_items
  WHERE user_id = auth.uid();
  
  RETURN total;
END;
$$;

-- Function to create order from cart
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
      selected_color
    )
    VALUES (
      new_order_id,
      cart_item.product_id,
      cart_item.product_name,
      cart_item.quantity,
      cart_item.unit_price,
      cart_item.selected_color
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_created_at ON cart_items(created_at DESC);