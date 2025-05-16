import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';


async function initDatabase() {
  try {
    console.log('Initializing PostgreSQL database...');
    
    // Create a connection to PostgreSQL
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'Nirupa@22',
      database: process.env.DB_NAME || 'auth_system'
    });
    

    await pool.end();
    
    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
initDatabase(); 