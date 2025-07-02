/*
  # Update Cart Item Note Function

  1. New Function
    - Update the update_cart_item_quantity function to accept customer_note parameter
    - Allow updating customer notes independently from quantity

  2. Security
    - Maintain existing security model with SECURITY DEFINER
    - Only allow users to update their own cart items
*/

-- Update update_cart_item_quantity function to include customer_note
CREATE OR REPLACE FUNCTION update_cart_item_quantity(
  p_cart_item_id uuid,
  p_quantity integer,
  p_customer_note text DEFAULT NULL -- New parameter
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
    SET 
        quantity = p_quantity,
        customer_note = COALESCE(p_customer_note, customer_note), -- Update customer_note if provided
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