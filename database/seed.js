import dotenv from 'dotenv';
import sequelize from '../backend/src/config/database.js';
import { User, Product, Address } from '../backend/src/models/index.js';

dotenv.config({ path: '../backend/.env' });

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    await sequelize.sync({ force: true });
    console.log('✓ Database synced');

    const adminUser = await User.create({
      email: 'admin@alcoholshop.co.za',
      passwordHash: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User',
      dateOfBirth: '1990-01-01',
      phone: '+27123456789',
      role: 'admin',
      emailVerified: true,
      ageVerified: true,
      ageVerifiedAt: new Date(),
    });
    console.log('✓ Admin user created');

    const customerUser = await User.create({
      email: 'customer@example.com',
      passwordHash: 'Customer123!',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1995-05-15',
      phone: '+27987654321',
      role: 'customer',
      emailVerified: true,
      ageVerified: true,
      ageVerifiedAt: new Date(),
    });
    console.log('✓ Customer user created');

    await Address.create({
      userId: customerUser.id,
      addressType: 'home',
      streetAddress: '123 Main Street',
      suburb: 'Sandton',
      city: 'Johannesburg',
      province: 'Gauteng',
      postalCode: '2196',
      isDefault: true,
    });

    const wines = [
      {
        name: 'Nederburg Cabernet Sauvignon',
        slug: 'nederburg-cabernet-sauvignon',
        description: 'A full-bodied red wine with rich fruit flavors and oak undertones.',
        category: 'wine',
        subcategory: 'red_wine',
        brand: 'Nederburg',
        alcoholContent: 13.5,
        volumeMl: 750,
        price: 89.99,
        stockQuantity: 50,
        imageUrl: 'https://via.placeholder.com/400x600?text=Nederburg+Cabernet',
        featured: true,
      },
      {
        name: 'KWV Chardonnay',
        slug: 'kwv-chardonnay',
        description: 'Crisp white wine with citrus and tropical fruit notes.',
        category: 'wine',
        subcategory: 'white_wine',
        brand: 'KWV',
        alcoholContent: 12.5,
        volumeMl: 750,
        price: 79.99,
        stockQuantity: 40,
        imageUrl: 'https://via.placeholder.com/400x600?text=KWV+Chardonnay',
        featured: true,
      },
      {
        name: 'Drostdy-Hof Sauvignon Blanc',
        slug: 'drostdy-hof-sauvignon-blanc',
        description: 'Fresh and fruity white wine perfect for summer.',
        category: 'wine',
        subcategory: 'white_wine',
        brand: 'Drostdy-Hof',
        alcoholContent: 12.0,
        volumeMl: 750,
        price: 59.99,
        stockQuantity: 60,
        imageUrl: 'https://via.placeholder.com/400x600?text=Drostdy-Hof+Sauvignon',
      },
    ];

    const beers = [
      {
        name: 'Castle Lager 6-Pack',
        slug: 'castle-lager-6-pack',
        description: 'South Africa\'s favorite premium lager beer.',
        category: 'beer',
        subcategory: 'lager',
        brand: 'Castle',
        alcoholContent: 5.0,
        volumeMl: 330,
        price: 89.99,
        stockQuantity: 100,
        imageUrl: 'https://via.placeholder.com/400x600?text=Castle+Lager',
        featured: true,
      },
      {
        name: 'Black Label 6-Pack',
        slug: 'black-label-6-pack',
        description: 'Bold and refreshing premium beer.',
        category: 'beer',
        subcategory: 'lager',
        brand: 'Black Label',
        alcoholContent: 5.5,
        volumeMl: 330,
        price: 84.99,
        stockQuantity: 80,
        imageUrl: 'https://via.placeholder.com/400x600?text=Black+Label',
      },
      {
        name: 'Windhoek Lager 6-Pack',
        slug: 'windhoek-lager-6-pack',
        description: 'Crisp and clean Namibian lager.',
        category: 'beer',
        subcategory: 'lager',
        brand: 'Windhoek',
        alcoholContent: 4.0,
        volumeMl: 330,
        price: 79.99,
        stockQuantity: 70,
        imageUrl: 'https://via.placeholder.com/400x600?text=Windhoek+Lager',
      },
    ];

    const spirits = [
      {
        name: 'Klipdrift Brandy',
        slug: 'klipdrift-brandy',
        description: 'Premium South African brandy, smooth and rich.',
        category: 'spirits',
        subcategory: 'brandy',
        brand: 'Klipdrift',
        alcoholContent: 43.0,
        volumeMl: 750,
        price: 149.99,
        stockQuantity: 30,
        imageUrl: 'https://via.placeholder.com/400x600?text=Klipdrift+Brandy',
        featured: true,
      },
      {
        name: 'Amarula Cream Liqueur',
        slug: 'amarula-cream-liqueur',
        description: 'Exotic cream liqueur made from the marula fruit.',
        category: 'spirits',
        subcategory: 'liqueur',
        brand: 'Amarula',
        alcoholContent: 17.0,
        volumeMl: 750,
        price: 179.99,
        stockQuantity: 25,
        imageUrl: 'https://via.placeholder.com/400x600?text=Amarula',
      },
      {
        name: 'Savanna Dry Cider 6-Pack',
        slug: 'savanna-dry-cider-6-pack',
        description: 'Refreshing dry apple cider.',
        category: 'cider',
        subcategory: 'dry_cider',
        brand: 'Savanna',
        alcoholContent: 6.0,
        volumeMl: 330,
        price: 94.99,
        stockQuantity: 90,
        imageUrl: 'https://via.placeholder.com/400x600?text=Savanna+Cider',
      },
    ];

    const allProducts = [...wines, ...beers, ...spirits];

    for (const productData of allProducts) {
      await Product.create(productData);
    }

    console.log(`✓ Created ${allProducts.length} products`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Admin: admin@alcoholshop.co.za / Admin123!');
    console.log('   Customer: customer@example.com / Customer123!');
    console.log('');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
