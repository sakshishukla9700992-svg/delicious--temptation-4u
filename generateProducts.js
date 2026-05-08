const fs = require('fs');

const products = [];
let idCounter = 1;

function getRandomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const unsplashIds = [
  '1578985545062-69928b1d9587', '1565958011703-44f9829ba187', '1576618148400-f54bed99fcfd',
  '1614707267537-b85aaf00c4b7', '1499636136210-6f4ee915583e', '1606313564200-e75d5e30476c',
  '1555507036-ab1f40ce88cb', '1551024601-bec78aea704b', '1585478259715-876a6a81fa08',
  '1558961363-fa8fdf82db35', '1519869325930-281384150729', '1569864358642-9d1684040f43',
  '1588195538320-062002235bd1', '1550617931-e17a7b70dce2', '1602664773289-e13cbdae2023',
  '1587668178277-295251f900ce', '1621303837174-89787a7d4729', '1551106651-1abf33c6fac0'
];

// Helper to generate a batch
function generateBatch(category, subCategory, names, count, priceRange, query) {
  const batch = [];
  for (let i = 0; i < count; i++) {
    const name = names[i % names.length] + (i >= names.length ? ` ${Math.floor(i/names.length) + 1}` : '');
    const randomImageId = unsplashIds[Math.floor(Math.random() * unsplashIds.length)];
    batch.push({
      id: idCounter++,
      name: name,
      category: category,
      subCategory: subCategory,
      price: getRandomPrice(priceRange[0], priceRange[1]),
      image: `https://images.unsplash.com/photo-${randomImageId}?auto=format&fit=crop&w=600&q=80`,
      rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1),
      reviews: Math.floor(Math.random() * 500) + 10,
      isBestseller: Math.random() > 0.8,
      flavor: subCategory
    });
  }
  return batch;
}

// 30 Cakes (10 chocolate, 8 fruit, 7 designer, 5 wedding)
products.push(...generateBatch('Cakes', 'Chocolate', ['Dark Chocolate Truffle', 'Choco Lava Delight', 'German Chocolate', 'Triple Chocolate Mousse', 'Choco Hazelnut', 'Death by Chocolate', 'Ferrero Rocher Cake', 'Mocha Fudge', 'Belgian Chocolate', 'Choco Chip Layer'], 10, [30, 60], 'chocolate-cake'));
products.push(...generateBatch('Cakes', 'Fruit', ['Fresh Pineapple', 'Mixed Berry Blast', 'Mango Tango', 'Strawberry Shortcake', 'Blueberry Cream', 'Zesty Lemon', 'Kiwi Sensation', 'Tropical Fruit'], 8, [35, 55], 'fruit-cake'));
products.push(...generateBatch('Cakes', 'Designer', ['Unicorn Fantasy', 'Mermaid Tail', 'Galaxy Drip', 'Fondant Floral', 'Super Hero Theme', 'Princess Castle', 'Gold Leaf Elegant'], 7, [50, 100], 'designer-cake'));
products.push(...generateBatch('Cakes', 'Wedding', ['Classic Tiered White', 'Rustic Naked Cake', 'Rose Gold Romance', 'Vintage Lace', 'Pearl Adorned'], 5, [100, 300], 'wedding-cake'));

// 20 Cupcakes (vanilla, chocolate, red velvet, oreo, etc.)
products.push(...generateBatch('Cupcakes', 'Vanilla', ['Classic Vanilla Bean', 'Vanilla Sprinkles', 'Golden Vanilla', 'Vanilla Raspberry', 'Vanilla Caramel'], 5, [3, 6], 'vanilla-cupcake'));
products.push(...generateBatch('Cupcakes', 'Chocolate', ['Double Chocolate', 'Choco Mint', 'Choco Peanut Butter', 'Choco Cherry', 'Dark Choco Ganache'], 5, [4, 7], 'chocolate-cupcake'));
products.push(...generateBatch('Cupcakes', 'Red Velvet', ['Classic Red Velvet', 'Red Velvet Cream Cheese', 'Red Velvet Berry', 'Mini Red Velvet'], 5, [4, 7], 'red-velvet-cupcake'));
products.push(...generateBatch('Cupcakes', 'Specialty', ['Oreo Dream', 'Salted Caramel', 'Lemon Meringue', 'Matcha Green Tea', 'Coffee Mocha'], 5, [5, 8], 'cupcake'));

// 15 Cookies (butter, choco chip, oatmeal, macarons, etc.)
products.push(...generateBatch('Cookies', 'Classic', ['Butter Cookies', 'Choco Chip', 'Oatmeal Raisin', 'Peanut Butter', 'Snickerdoodle'], 5, [2, 5], 'cookie'));
products.push(...generateBatch('Cookies', 'Premium', ['White Choco Macadamia', 'Double Choco Chunk', 'Almond Biscotti', 'Pistachio Cranberry'], 5, [4, 8], 'premium-cookie'));
products.push(...generateBatch('Cookies', 'Macarons', ['French Vanilla Macaron', 'Pistachio Macaron', 'Raspberry Macaron', 'Lavender Macaron', 'Lemon Macaron'], 5, [10, 20], 'macarons'));

// 15 Donuts (glazed, sprinkle, nutella, strawberry, etc.)
products.push(...generateBatch('Donuts', 'Classic', ['Original Glazed', 'Chocolate Frosted', 'Strawberry Sprinkles', 'Cinnamon Sugar'], 5, [2, 4], 'donut'));
products.push(...generateBatch('Donuts', 'Filled', ['Nutella Filled', 'Boston Cream', 'Jelly Filled', 'Vanilla Custard'], 5, [3, 6], 'filled-donut'));
products.push(...generateBatch('Donuts', 'Gourmet', ['Maple Bacon', 'Matcha Glazed', 'Caramel Crunch', 'Blueberry Crumble', 'Smores Donut'], 5, [4, 7], 'gourmet-donut'));

// 20 Gift Hampers (birthday box, anniversary, corporate, festival)
products.push(...generateBatch('Gift Hampers', 'Birthday', ['Ultimate Birthday Box', 'Sweet Sixteen Hamper', 'Kids Party Pack', 'Choco Lover Birthday', 'Surprise Mini Cakes'], 5, [40, 80], 'gift-box'));
products.push(...generateBatch('Gift Hampers', 'Anniversary', ['Romantic Rose Hamper', 'Silver Jubilee Treat', 'Golden Anniversary Special', 'Love & Chocolates', 'Couples Dessert Box'], 5, [50, 100], 'anniversary-gift'));
products.push(...generateBatch('Gift Hampers', 'Corporate', ['Executive Treat Box', 'Office Celebration', 'Client Appreciation', 'Team Success Hamper', 'Premium Desk Snacks'], 5, [60, 150], 'corporate-gift'));
products.push(...generateBatch('Gift Hampers', 'Festival', ['Diwali Sweet Box', 'Christmas Joy Hamper', 'Holi Special Treats', 'Eid Dessert Platter', 'Festive Celebration'], 5, [30, 90], 'festival-sweets'));

// Write to productsData.js (to avoid CORS issues on file:// protocol)
const jsContent = `const productsData = ${JSON.stringify(products, null, 2)};`;
fs.writeFileSync('productsData.js', jsContent);
console.log(`Generated ${products.length} products in productsData.js`);
