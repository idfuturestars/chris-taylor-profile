// Seeder execution script
import { seedEmptyTables } from "./comprehensive-seeder";

async function main() {
  try {
    await seedEmptyTables();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

main();