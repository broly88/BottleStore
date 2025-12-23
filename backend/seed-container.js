import dotenv from 'dotenv';
import sequelize from './src/config/database.js';
import { User, Product } from './src/models/index.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    console.log('📊 Database connection established');

    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized');

    // Seed Users
    const users = await User.bulkCreate([
      {
        email: 'admin@liquorshop.co.za',
        password: 'Admin123!@#',
        firstName: 'Admin',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        role: 'admin',
        ageVerified: true,
        emailVerified: true,
      },
      {
        email: 'john@example.com',
        password: 'Customer123!@#',
        firstName: 'John',
        lastName: 'Doe',
        phone: '0821234567',
        dateOfBirth: '1995-05-15',
        role: 'customer',
        ageVerified: true,
        emailVerified: true,
      },
    ], {
      individualHooks: true,
    });
    console.log('✅ Created 2 users (1 admin, 1 customer)');

    // Seed Products
    const products = await Product.bulkCreate([
      // Wines
      {
        name: 'Nederburg Cabernet Sauvignon',
        slug: 'nederburg-cabernet-sauvignon',
        description: 'A full-bodied red wine with rich flavors of blackcurrant and oak.',
        category: 'wine',
        subcategory: 'red_wine',
        brand: 'Nederburg',
        alcoholContent: 13.5,
        volumeMl: 750,
        price: 89.99,
        stockQuantity: 50,
        imageUrl: 'https://via.placeholder.com/300x400?text=Nederburg+Cab+Sauv',
        featured: true,
      },
      {
        name: 'KWV Chardonnay',
        slug: 'kwv-chardonnay',
        description: 'Crisp white wine with notes of citrus and vanilla.',
        category: 'wine',
        subcategory: 'white_wine',
        brand: 'KWV',
        alcoholContent: 13.0,
        volumeMl: 750,
        price: 79.99,
        stockQuantity: 45,
        imageUrl: 'https://via.placeholder.com/300x400?text=KWV+Chardonnay',
        featured: true,
      },
      // Beers
      {
        name: 'Castle Lager 6-Pack',
        slug: 'castle-lager-6pack',
        description: 'South Africa\'s premium lager beer.',
        category: 'beer',
        subcategory: 'lager',
        brand: 'Castle',
        alcoholContent: 5.0,
        volumeMl: 330,
        price: 89.99,
        stockQuantity: 100,
        imageUrl: 'https://via.placeholder.com/300x400?text=Castle+Lager',
        featured: true,
      },
      {
        name: 'Black Label 24-Pack',
        slug: 'black-label-24pack',
        description: 'The beer that is as tough as the people who drink it.',
        category: 'beer',
        subcategory: 'lager',
        brand: 'Black Label',
        alcoholContent: 5.5,
        volumeMl: 340,
        price: 299.99,
        stockQuantity: 75,
        imageUrl: 'https://via.placeholder.com/300x400?text=Black+Label',
      },
      // Spirits
      {
        name: 'Klipdrift Premium Brandy',
        slug: 'klipdrift-premium-brandy',
        description: 'Smooth and refined South African brandy.',
        category: 'spirits',
        subcategory: 'brandy',
        brand: 'Klipdrift',
        alcoholContent: 43.0,
        volumeMl: 750,
        price: 149.99,
        stockQuantity: 30,
        imageUrl: 'https://via.placeholder.com/300x400?text=Klipdrift+Brandy',
        featured: true,
      },
      {
        name: 'Johnnie Walker Red Label',
        slug: 'johnnie-walker-red',
        description: 'Bold, characterful whisky with a vibrant blend.',
        category: 'spirits',
        subcategory: 'whiskey',
        brand: 'Johnnie Walker',
        alcoholContent: 40.0,
        volumeMl: 750,
        price: 199.99,
        stockQuantity: 40,
        imageUrl: 'https://via.placeholder.com/300x400?text=JW+Red',
      },
    ]);
    console.log(`✅ Created ${products.length} products`);

    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('👤 Admin credentials: admin@liquorshop.co.za / Admin123!@#');
    console.log('👤 Customer credentials: john@example.com / Customer123!@#\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
