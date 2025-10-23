/*
  # Messy Bite Seafood & Grill Menu Import
  
  This SQL file imports the complete menu for Messy Bite Seafood & Grill.
  
  1. Categories
    - unli-rice: Unli Rice meals
    - platter: Platter dishes (good for sharing)
    - sabao: Soups and stews
    - savers: Value meals
    - boodle-bilao: Feast trays
    - add-ons: Add-on options
    
  2. Menu Items
    - All items use auto-generated UUIDs (gen_random_uuid())
    - Variations added for items with size options (S/M)
    - Proper categorization for easy browsing
*/

-- First, add the categories for Messy Bite Seafood & Grill
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  ('unli-rice', 'Unli Rice', '🍚', 1, true),
  ('platter', 'Platter', '🍤', 2, true),
  ('sabao', 'Sabao', '🍲', 3, true),
  ('savers', 'Savers', '💰', 4, true),
  ('boodle-bilao', 'Boodle Bilao', '🎉', 5, true),
  ('add-ons', 'Add-Ons', '🍱', 6, true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- UNLI RICE CATEGORY
-- =====================================================
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Paa Inasal', 'Grilled chicken leg marinated in special spices. Served with unlimited rice.', 169.00, 'unli-rice', true, true),
  ('Grilled Tuna Belly', 'Fresh tuna belly grilled to perfection. Served with unlimited rice.', 245.00, 'unli-rice', true, true),
  ('Grilled Tuna Panga', 'Premium tuna jaw grilled with signature seasoning. Served with unlimited rice. Available in Small and Medium sizes.', 199.00, 'unli-rice', true, true),
  ('Grilled Pork Belly', 'Juicy pork belly grilled with sweet and savory glaze. Served with unlimited rice.', 210.00, 'unli-rice', true, true),
  ('Chicken BBQ Leg', 'Tender chicken leg with Filipino-style BBQ sauce. Served with unlimited rice.', 209.00, 'unli-rice', false, true),
  ('Fried Bangus', 'Crispy fried milkfish seasoned to perfection. Served with unlimited rice.', 275.00, 'unli-rice', false, true),
  ('Grilled Bangus', 'Milkfish grilled with garlic and herbs. Served with unlimited rice.', 225.00, 'unli-rice', true, true),
  ('Calamares', 'Crispy breaded squid rings with special dipping sauce. Served with unlimited rice.', 169.00, 'unli-rice', false, true),
  ('Porkchop', 'Juicy grilled porkchop with savory marinade. Served with unlimited rice.', 150.00, 'unli-rice', false, true),
  ('Longganisa Hungarian', 'Filipino-style Hungarian sausage. Served with unlimited rice.', 140.00, 'unli-rice', false, true),
  ('Sausage', 'Grilled sausage links. Served with unlimited rice.', 140.00, 'unli-rice', false, true),
  ('Unli Rice Combo Upgrade', 'Add P80 to any Unli Rice meal to include: Calamares, Chicken Skin, Shrimp, and 3pc Lumpia', 80.00, 'unli-rice', true, true);

-- Add variation for Grilled Tuna Panga (Small/Medium)
-- First, we need to get the menu_item_id, so we'll use a CTE
WITH tuna_panga AS (
  SELECT id FROM menu_items WHERE name = 'Grilled Tuna Panga' AND category = 'unli-rice' LIMIT 1
)
INSERT INTO variations (menu_item_id, name, price)
SELECT id, 'Small', 199.00 FROM tuna_panga
UNION ALL
SELECT id, 'Medium', 249.00 FROM tuna_panga;

-- =====================================================
-- PLATTER CATEGORY (Good for Sharing)
-- =====================================================
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Calamares Platter', 'Crispy breaded squid rings perfect for sharing. Good for 3-4 persons.', 310.00, 'platter', true, true),
  ('Pancit Bihon', 'Filipino-style stir-fried rice noodles with vegetables and meat. Good for 3-4 persons.', 210.00, 'platter', false, true),
  ('12pc Lumpia', 'Twelve pieces of crispy spring rolls. Perfect appetizer for sharing.', 199.00, 'platter', false, true),
  ('8pc Porkchop', 'Eight pieces of grilled porkchops. Great for sharing.', 240.00, 'platter', false, true),
  ('Chopsuey', 'Mixed vegetables stir-fried in savory sauce. Good for 3-4 persons.', 240.00, 'platter', false, true),
  ('Kinilaw Gulbado', 'Premium fresh seafood ceviche with special marinade. Good for 2-3 persons.', 210.00, 'platter', true, true),
  ('Kinilaw', 'Fresh seafood ceviche with vinegar and spices. Good for 2-3 persons.', 120.00, 'platter', false, true),
  ('8pc Cheesy Scallops', 'Eight pieces of scallops topped with creamy cheese. Perfect sharing dish.', 160.00, 'platter', false, true),
  ('Grilled Tuna Scallops', 'Fresh tuna scallops grilled with butter and herbs. Good for 2-3 persons.', 180.00, 'platter', false, true),
  ('Chicken Skin', 'Crispy fried chicken skin. Perfect beer match. Good for 2-3 persons.', 135.00, 'platter', true, true);

-- =====================================================
-- SABAO CATEGORY (Soups/Stew)
-- =====================================================
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Pochero', 'Filipino beef stew with vegetables and sweet plantains. Good for 3-4 persons.', 320.00, 'sabao', true, true),
  ('Tinola', 'Chicken soup with ginger, green papaya, and chili leaves. Good for 3-4 persons.', 150.00, 'sabao', false, true),
  ('Hala-an', 'Traditional seafood soup with ginger and vegetables. Good for 2-3 persons.', 150.00, 'sabao', false, true),
  ('Bulbah', 'Rich and savory beef soup with vegetables. Good for 2-3 persons.', 180.00, 'sabao', false, true),
  ('Balbacua', 'Slow-cooked beef stew with collagen-rich meat and spices. Good for 2-3 persons.', 180.00, 'sabao', true, true);

-- =====================================================
-- SAVERS CATEGORY (Value Meals)
-- =====================================================
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Sisig Savers', 'Sizzling pork sisig with rice. Budget-friendly meal.', 99.00, 'savers', true, true),
  ('3pc Fried Chicken', 'Three pieces of crispy fried chicken with rice. Value meal.', 99.00, 'savers', true, true),
  ('Dinuguan Ginamit', 'Filipino pork blood stew with rice. Traditional comfort food.', 99.00, 'savers', false, true),
  ('Burger Steak', 'Filipino-style burger patty with gravy and rice. Classic value meal.', 99.00, 'savers', false, true),
  ('5pc Lumpia', 'Five pieces of crispy spring rolls with rice. Budget-friendly combo.', 99.00, 'savers', false, true);

-- =====================================================
-- BOODLE BILAO CATEGORY (Feast Trays)
-- =====================================================
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Barkada Night Out', 'Ultimate feast tray with Paa, Pecho, Shrimp (240g), Calamares, Isda, Porkchop, Mango, Cucumber, Rice, and Soda or Juice. Perfect for group gatherings!', 999.00, 'boodle-bilao', true, true),
  ('Seafood Mukbang', 'Seafood lover''s feast! Includes: Fried Bangus (2pcs), Shrimp (240g), Calamares, Squid, Scallops (600g), Mango, Cucumber, Rice, and Soda or Juice. Good for 4-6 persons.', 1215.00, 'boodle-bilao', true, true),
  ('Messy Overload', 'The ultimate Messy Bite experience! Pork Belly, Paa, Pecho, Shrimp (240g), Lumpia (10pcs), Kinilaw Gulbado, Mango, Cucumber, Rice, and Soda or Juice. Good for 4-6 persons.', 1319.00, 'boodle-bilao', true, true);

-- =====================================================
-- ADD-ONS CATEGORY
-- =====================================================
INSERT INTO menu_items (name, description, base_price, category, popular, available) VALUES
  ('Plain Rice', 'Steamed white rice.', 20.00, 'add-ons', false, true),
  ('Garlic Rice', 'Fragrant garlic fried rice.', 25.00, 'add-ons', true, true),
  ('Java Rice', 'Turmeric-flavored yellow rice.', 25.00, 'add-ons', false, true),
  ('Egg', 'Fried egg.', 15.00, 'add-ons', false, true),
  ('Atchara', 'Pickled green papaya relish.', 15.00, 'add-ons', false, true);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Messy Bite Seafood & Grill menu has been successfully imported!';
  RAISE NOTICE 'Total categories: 6 (Unli Rice, Platter, Sabao, Savers, Boodle Bilao, Add-Ons)';
  RAISE NOTICE 'Total menu items: 42';
  RAISE NOTICE 'Items with variations: 1 (Grilled Tuna Panga - Small/Medium)';
END $$;

