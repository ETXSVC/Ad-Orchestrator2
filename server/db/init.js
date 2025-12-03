import { initDatabase, seedDatabase, closeDatabase } from './database.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Initializing Ad-Orchestrator database...\n');

// Initialize schema
initDatabase();

// Seed with initial data
seedDatabase();

// Close connection
setTimeout(() => {
    closeDatabase();
    console.log('\n✓ Database setup complete!');
    process.exit(0);
}, 1000);
