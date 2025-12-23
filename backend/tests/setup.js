// Test setup and configuration
const { sequelize } = require('../src/models');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://liquorshop:liquorshop123@localhost:5432/liquorshop_test';

// Global test timeout
jest.setTimeout(10000);

// Setup before all tests
beforeAll(async () => {
  try {
    // Sync database (create tables)
    await sequelize.sync({ force: true });
    console.log('Test database synchronized');
  } catch (error) {
    console.error('Failed to sync test database:', error);
    throw error;
  }
});

// Cleanup after all tests
afterAll(async () => {
  try {
    await sequelize.close();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Failed to close test database connection:', error);
  }
});

// Clear database between tests
beforeEach(async () => {
  // Truncate all tables except migrations
  const models = Object.keys(sequelize.models);
  for (const modelName of models) {
    await sequelize.models[modelName].destroy({ where: {}, force: true });
  }
});
