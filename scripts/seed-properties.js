const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Sample hotel data with realistic metrics
const sampleProperties = [
  {
    name: "Grand Plaza Hotel",
    city: "Atlanta",
    state: "GA",
    rooms: 250,
    adr: 185.50,
    occupancy: 0.78,
    revpar: 144.69,
    rating: 4.2,
    amenities: ["Pool", "Gym", "WiFi", "Restaurant", "Spa", "Parking"],
    description: "Luxury hotel in downtown Atlanta with modern amenities",
    address: "123 Peachtree St, Atlanta, GA 30309"
  },
  {
    name: "Coastal Inn & Suites",
    city: "Savannah",
    state: "GA", 
    rooms: 120,
    adr: 165.75,
    occupancy: 0.85,
    revpar: 140.89,
    rating: 4.0,
    amenities: ["Pool", "WiFi", "Continental Breakfast", "Parking"],
    description: "Charming hotel near Savannah's historic district",
    address: "456 River St, Savannah, GA 31401"
  },
  {
    name: "Mountain View Resort",
    city: "Blue Ridge",
    state: "GA",
    rooms: 180,
    adr: 220.00,
    occupancy: 0.72,
    revpar: 158.40,
    rating: 4.5,
    amenities: ["Pool", "Gym", "WiFi", "Restaurant", "Spa", "Golf Course", "Hiking Trails"],
    description: "Scenic mountain resort with outdoor activities",
    address: "789 Mountain View Dr, Blue Ridge, GA 30513"
  },
  {
    name: "Business Express Hotel",
    city: "Macon",
    state: "GA",
    rooms: 95,
    adr: 125.25,
    occupancy: 0.68,
    revpar: 85.17,
    rating: 3.8,
    amenities: ["WiFi", "Business Center", "Continental Breakfast", "Parking"],
    description: "Convenient business hotel with modern facilities",
    address: "321 Business Blvd, Macon, GA 31201"
  },
  {
    name: "Seaside Resort & Spa",
    city: "Jekyll Island",
    state: "GA",
    rooms: 300,
    adr: 275.00,
    occupancy: 0.82,
    revpar: 225.50,
    rating: 4.7,
    amenities: ["Pool", "Gym", "WiFi", "Restaurant", "Spa", "Beach Access", "Golf Course", "Tennis Court"],
    description: "Luxury beachfront resort with full-service spa",
    address: "100 Ocean View Ave, Jekyll Island, GA 31527"
  },
  {
    name: "Historic Downtown Inn",
    city: "Augusta",
    state: "GA",
    rooms: 75,
    adr: 145.00,
    occupancy: 0.75,
    revpar: 108.75,
    rating: 4.1,
    amenities: ["WiFi", "Restaurant", "Historic Tours", "Parking"],
    description: "Boutique hotel in Augusta's historic district",
    address: "555 Historic St, Augusta, GA 30901"
  },
  {
    name: "Airport Gateway Hotel",
    city: "Atlanta",
    state: "GA",
    rooms: 200,
    adr: 135.00,
    occupancy: 0.88,
    revpar: 118.80,
    rating: 3.9,
    amenities: ["WiFi", "Shuttle Service", "Business Center", "Gym", "Parking"],
    description: "Convenient airport hotel with shuttle service",
    address: "2000 Airport Way, Atlanta, GA 30337"
  },
  {
    name: "University Lodge",
    city: "Athens",
    state: "GA",
    rooms: 110,
    adr: 155.50,
    occupancy: 0.79,
    revpar: 122.85,
    rating: 4.0,
    amenities: ["WiFi", "Pool", "Restaurant", "Conference Rooms", "Parking"],
    description: "Modern hotel near University of Georgia campus",
    address: "800 College Ave, Athens, GA 30601"
  },
  {
    name: "Lakeside Retreat",
    city: "Lake Lanier",
    state: "GA",
    rooms: 85,
    adr: 195.75,
    occupancy: 0.71,
    revpar: 138.98,
    rating: 4.3,
    amenities: ["Pool", "WiFi", "Lake Access", "Boat Rental", "Restaurant", "Spa"],
    description: "Peaceful lakeside hotel with water activities",
    address: "150 Lakeside Dr, Buford, GA 30518"
  },
  {
    name: "Convention Center Hotel",
    city: "Columbus",
    state: "GA",
    rooms: 275,
    adr: 175.00,
    occupancy: 0.74,
    revpar: 129.50,
    rating: 4.1,
    amenities: ["WiFi", "Restaurant", "Conference Rooms", "Business Center", "Gym", "Parking"],
    description: "Full-service hotel connected to convention center",
    address: "400 Convention Blvd, Columbus, GA 31901"
  }
];

async function seedProperties() {
  try {
    console.log('🌱 Starting property seeding...');

    // Clear existing properties
    await prisma.property.deleteMany({});
    console.log('🧹 Cleared existing properties');

    // Create new properties
    for (const property of sampleProperties) {
      await prisma.property.create({
        data: {
          ...property,
          status: 'ACTIVE'
        }
      });
      console.log(`✅ Created property: ${property.name}`);
    }

    console.log(`🎉 Successfully seeded ${sampleProperties.length} properties!`);
    
    // Display summary
    const properties = await prisma.property.findMany({
      select: {
        name: true,
        city: true,
        adr: true,
        occupancy: true,
        revpar: true,
        rooms: true
      }
    });
    
    console.log('\n📊 Property Summary:');
    console.table(properties);

  } catch (error) {
    console.error('❌ Error seeding properties:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedProperties()
    .then(() => {
      console.log('✨ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedProperties };
