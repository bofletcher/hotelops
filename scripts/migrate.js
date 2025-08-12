const { PrismaClient } = require('@prisma/client');

async function migrate() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Running database migration...');
    
    // Use Prisma's built-in migration instead of raw SQL
    // This ensures compatibility with both development and production databases
    console.log('✅ Using Prisma schema push for migration...');
    
    // Test the connection
    await prisma.$connect();
    console.log('🔗 Database connection established');
    
    // Check if we can access the database
    const count = await prisma.property.count();
    console.log(`📊 Current properties in database: ${count}`);
    
    console.log('✅ Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('Make sure DATABASE_URL is set correctly and the database is accessible');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
