/*
  # Add Delivery Fields to Orders Table

  1. New Fields
    - `delivery_method` - Standard or Express delivery option
    - `delivery_fee` - Cost of delivery

  2. Updates
    - Adds delivery information to orders table
    - Maintains backward compatibility
*/

-- Add delivery fields to orders table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'delivery_method'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_method text DEFAULT 'standard';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'delivery_fee'
  ) THEN
    ALTER TABLE orders ADD COLUMN delivery_fee numeric(10,2) DEFAULT 0;
  END IF;
END $$;