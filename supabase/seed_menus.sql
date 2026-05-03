-- Seed Chef Menu Data for ChefMii

-- Marco Rossi (Italian) - Chef ID: 11111111-1111-1111-1111-111111111111
INSERT INTO chef_menus (chef_id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Marco''s Italian Kitchen', 'Authentic Italian cuisine from Milan');

INSERT INTO menu_items 
  (chef_id, name, description, price, is_featured, prep_time_mins, dietary_tags, most_liked_rank) VALUES
('11111111-1111-1111-1111-111111111111', 'Secret Carbonara', 'Guanciale, Pecorino Romano, free-range eggs, fresh pasta. Marco''s signature dish.', 18.50, true, 25, ARRAY['gluten'], 1),
('11111111-1111-1111-1111-111111111111', 'Truffle Risotto', 'Carnaroli rice, black truffle, Parmigiano-Reggiano, white wine.', 22.00, true, 30, ARRAY['vegetarian'], 2),
('11111111-1111-1111-1111-111111111111', 'Osso Buco', 'Braised veal shanks, gremolata, saffron risotto alla Milanese.', 28.00, false, 45, ARRAY[], 3),
('11111111-1111-1111-1111-111111111111', 'Tiramisu', 'House-made ladyfingers, mascarpone, espresso, Marsala. Serves 2.', 12.00, false, 10, ARRAY['vegetarian'], null),
('11111111-1111-1111-1111-111111111111', 'Pappardelle al Cinghiale', 'Wide ribbon pasta with wild boar ragù, Pecorino shavings.', 20.00, false, 35, ARRAY['gluten'], null),
('11111111-1111-1111-1111-111111111111', 'Branzino al Forno', 'Whole Mediterranean sea bass, lemon, herbs, roasted potatoes.', 32.00, false, 40, ARRAY['gluten-free'], null);

-- Yuki Tanaka (Japanese) - Chef ID: 22222222-2222-2222-2222-222222222222
INSERT INTO chef_menus (chef_id, name, description) VALUES
('22222222-2222-2222-2222-222222222222', 'Yuki''s Sushi Bar', 'Premium Japanese cuisine and sushi');

INSERT INTO menu_items
  (chef_id, name, description, price, is_featured, prep_time_mins, dietary_tags, most_liked_rank) VALUES
('22222222-2222-2222-2222-222222222222', 'Omakase Sushi Set', '12 pieces chef''s choice nigiri, wasabi, pickled ginger, miso soup.', 38.00, true, 40, ARRAY['gluten-free'], 1),
('22222222-2222-2222-2222-222222222222', 'Ramen Tonkotsu', 'Rich pork bone broth, chashu pork, soft-boiled egg, nori, bamboo shoots.', 16.50, true, 30, ARRAY[], 2),
('22222222-2222-2222-2222-222222222222', 'Gyoza (8 pieces)', 'Pan-fried pork and cabbage dumplings, ponzu dipping sauce.', 9.00, false, 20, ARRAY[], 3),
('22222222-2222-2222-2222-222222222222', 'Tempura Platter', 'Assorted shrimp and vegetable tempura, dipping sauce.', 14.00, false, 25, ARRAY[], null),
('22222222-2222-2222-2222-222222222222', 'Unagi Don', 'Grilled eel over rice, sweet glaze, sesame seeds.', 17.50, false, 20, ARRAY[], null),
('22222222-2222-2222-2222-222222222222', 'Miso Soup', 'Traditional miso soup with tofu and seaweed.', 5.00, false, 10, ARRAY['vegetarian', 'gluten-free'], null);

-- James Okafor (West African) - Chef ID: 44444444-4444-4444-4444-444444444444
INSERT INTO chef_menus (chef_id, name, description) VALUES
('44444444-4444-4444-4444-444444444444', 'James'' West African Kitchen', 'Authentic flavors from Lagos to London');

INSERT INTO menu_items 
  (chef_id, name, description, price, is_featured, prep_time_mins, dietary_tags, most_liked_rank) VALUES
('44444444-4444-4444-4444-444444444444', 'Lagos Jollof Rice', 'Party-style jollof with smoky tomato base, served with fried plantain and coleslaw.', 16.00, true, 35, ARRAY['gluten-free'], 1),
('44444444-4444-4444-4444-444444444444', 'Suya Platter', 'Spiced beef skewers with yaji spice, sliced onions, tomatoes. 6 skewers.', 19.00, true, 25, ARRAY['gluten-free'], 2),
('44444444-4444-4444-4444-444444444444', 'Egusi Soup', 'Ground melon seeds, palm oil, leafy greens, assorted meat. Served with fufu.', 17.50, false, 40, ARRAY['gluten-free'], 3),
('44444444-4444-4444-4444-444444444444', 'Puff Puff (6 pieces)', 'Deep-fried dough balls, lightly sweetened. West African street food.', 6.00, false, 15, ARRAY['vegetarian'], null),
('44444444-4444-4444-4444-444444444444', 'Pepper Soup', 'Spicy goat meat or chicken soup with peppers and spices.', 13.00, false, 30, ARRAY['gluten-free'], null),
('44444444-4444-4444-4444-444444444444', 'Moi Moi', 'Steamed bean pudding with peppers, onions, and spices.', 8.00, false, 25, ARRAY['vegetarian', 'gluten-free'], null);

-- Sophie Leclerc (French) - Chef ID: 33333333-3333-3333-3333-333333333333
INSERT INTO chef_menus (chef_id, name, description) VALUES
('33333333-3333-3333-3333-333333333333', 'Sophie''s French Bistro', 'Classic French cuisine from Paris');

INSERT INTO menu_items
  (chef_id, name, description, price, is_featured, prep_time_mins, dietary_tags, most_liked_rank) VALUES
('33333333-3333-3333-3333-333333333333', 'Coq au Vin', 'Chicken braised in red wine with mushrooms and pearl onions.', 24.00, true, 50, ARRAY[], 1),
('33333333-3333-3333-3333-333333333333', 'Beef Bourguignon', 'Tender beef in rich burgundy wine sauce with root vegetables.', 26.00, true, 55, ARRAY[], 2),
('33333333-3333-3333-3333-333333333333', 'Crème Brûlée', 'Silky vanilla custard with caramelized sugar top.', 8.00, false, 15, ARRAY['vegetarian'], 3),
('33333333-3333-3333-3333-333333333333', 'Escargots de Bourgogne', 'Snails in garlic, parsley, and butter sauce. 6 pieces.', 16.00, false, 20, ARRAY[], null),
('33333333-3333-3333-3333-333333333333', 'Ratatouille', 'Vegetable medley with eggplant, zucchini, tomatoes, and herbs.', 12.00, false, 35, ARRAY['vegetarian', 'gluten-free'], null),
('33333333-3333-3333-3333-333333333333', 'Tarte Tatin', 'Caramelized apple tart with vanilla ice cream.', 9.00, false, 20, ARRAY['vegetarian'], null);

-- Priya Sharma (Indian) - Chef ID: 55555555-5555-5555-5555-555555555555
INSERT INTO chef_menus (chef_id, name, description) VALUES
('55555555-5555-5555-5555-555555555555', 'Priya''s Indian Spice House', 'Authentic Indian cuisine from Mumbai');

INSERT INTO menu_items
  (chef_id, name, description, price, is_featured, prep_time_mins, dietary_tags, most_liked_rank) VALUES
('55555555-5555-5555-5555-555555555555', 'Butter Chicken', 'Tender chicken in creamy tomato sauce with aromatic spices.', 16.00, true, 30, ARRAY[], 1),
('55555555-5555-5555-5555-555555555555', 'Lamb Biryani', 'Fragrant basmati rice with tender lamb and spices.', 18.00, true, 40, ARRAY['gluten-free'], 2),
('55555555-5555-5555-5555-555555555555', 'Paneer Tikka Masala', 'Cottage cheese in spiced tomato cream sauce.', 14.00, false, 25, ARRAY['vegetarian'], 3),
('55555555-5555-5555-5555-555555555555', 'Samosa (3 pieces)', 'Crispy pastry with spiced potato and pea filling.', 6.00, false, 15, ARRAY['vegetarian'], null),
('55555555-5555-5555-5555-555555555555', 'Tandoori Chicken', 'Marinated chicken cooked in clay oven, served with naan.', 17.00, false, 35, ARRAY['gluten-free'], null),
('55555555-5555-5555-5555-555555555555', 'Gulab Jamun', 'Soft milk solids in rose-flavored syrup. 4 pieces.', 7.00, false, 10, ARRAY['vegetarian'], null);

-- Carlos Rodriguez (Spanish) - Chef ID: 66666666-6666-6666-6666-666666666666
INSERT INTO chef_menus (chef_id, name, description) VALUES
('66666666-6666-6666-6666-666666666666', 'Carlos'' Spanish Tapas', 'Spanish cuisine and tapas from Barcelona');

INSERT INTO menu_items
  (chef_id, name, description, price, is_featured, prep_time_mins, dietary_tags, most_liked_rank) VALUES
('66666666-6666-6666-6666-666666666666', 'Paella Valenciana', 'Saffron rice with chicken, rabbit, and green beans.', 22.00, true, 45, ARRAY['gluten-free'], 1),
('66666666-6666-6666-6666-666666666666', 'Gambas al Ajillo', 'Garlic shrimp in olive oil and white wine. 8 pieces.', 18.00, true, 20, ARRAY['gluten-free'], 2),
('66666666-6666-6666-6666-666666666666', 'Patatas Bravas', 'Crispy potatoes with spicy tomato and aioli sauce.', 8.00, false, 15, ARRAY['vegetarian', 'gluten-free'], 3),
('66666666-6666-6666-6666-666666666666', 'Croquetas de Jamón', 'Ham croquettes, creamy inside, crispy outside. 6 pieces.', 10.00, false, 20, ARRAY[], null),
('66666666-6666-6666-6666-666666666666', 'Gazpacho', 'Cold tomato soup, perfect for summer.', 7.00, false, 10, ARRAY['vegetarian', 'gluten-free'], null),
('66666666-6666-6666-6666-666666666666', 'Flan', 'Spanish custard tart with caramel sauce.', 8.00, false, 15, ARRAY['vegetarian'], null);
