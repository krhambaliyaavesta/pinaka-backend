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
      database: process.env.DB_NAME || 'auth_system',
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
      } : undefined
    });
    
    // Check if tables exist
    const checkTableQuery = `
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `;
    const tableResult = await pool.query(checkTableQuery);
    
    if (tableResult.rows.length === 0) {
      console.log('Creating users table...');
      
      // Create roles table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS roles (
          id SERIAL PRIMARY KEY,
          role_name VARCHAR(50) NOT NULL UNIQUE
        )
      `);
      
      // Insert standard roles
      await pool.query(`
        INSERT INTO roles (id, role_name) 
        VALUES (1, 'admin'), (2, 'lead'), (3, 'member')
        ON CONFLICT DO NOTHING
      `);
      
      // Create users table with role as INTEGER
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(36) PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          role INTEGER NOT NULL DEFAULT 3,
          job_title VARCHAR(255) NOT NULL,
          approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
          created_at TIMESTAMP NOT NULL,
          updated_at TIMESTAMP NOT NULL
        )
      `);
      
      // Create ENUM type for approval status if it doesn't exist
      await pool.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_status_enum') THEN
            CREATE TYPE approval_status_enum AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
          END IF;
        END
        $$;
      `);
      
      console.log('Tables created successfully');
    } else {
      // Check if job_title column exists
      const checkJobTitleQuery = `
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'job_title'
      `;
      const jobTitleResult = await pool.query(checkJobTitleQuery);
      
      if (jobTitleResult.rows.length === 0) {
        console.log('Adding job_title column to users table...');
        await pool.query(`ALTER TABLE users ADD COLUMN job_title VARCHAR(255) NOT NULL DEFAULT 'Not Specified'`);
      }
      
      // Check if approval_status column exists
      const checkApprovalStatusQuery = `
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'approval_status'
      `;
      const approvalStatusResult = await pool.query(checkApprovalStatusQuery);
      
      if (approvalStatusResult.rows.length === 0) {
        console.log('Adding approval_status column to users table...');
        await pool.query(`ALTER TABLE users ADD COLUMN approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING'`);
      }

      // Check the role column type
      const checkRoleColumnQuery = `
        SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
      `;
      const columnResult = await pool.query(checkRoleColumnQuery);
      
      if (columnResult.rows.length > 0) {
        const dataType = columnResult.rows[0].data_type;
        console.log(`Current 'role' column type: ${dataType}`);
        
        // If the role is not an integer type, alter the table
        if (dataType.toLowerCase() !== 'integer') {
          console.log('Altering role column to INTEGER type...');
          
          // First try to convert existing data
          try {
            await pool.query(`
              ALTER TABLE users 
              ALTER COLUMN role TYPE INTEGER USING 
                CASE 
                  WHEN role = 'admin' THEN 1
                  WHEN role = 'lead' THEN 2
                  WHEN role = 'user' OR role = 'member' THEN 3
                  ELSE 3
                END
            `);
            console.log('Role column successfully converted to INTEGER');
          } catch (error) {
            console.error('Error converting role column:', error);
            console.log('Trying alternative approach...');
            
            // If conversion fails, try a more drastic approach
            try {
              // Create a temporary column
              await pool.query(`ALTER TABLE users ADD COLUMN role_new INTEGER DEFAULT 3`);
              
              // Update the temporary column based on existing values
              await pool.query(`
                UPDATE users SET role_new = 
                  CASE 
                    WHEN role::text = 'admin' THEN 1
                    WHEN role::text = 'lead' THEN 2
                    WHEN role::text = 'user' OR role::text = 'member' THEN 3
                    ELSE 3
                  END
              `);
              
              // Drop the old column and rename the new one
              await pool.query(`ALTER TABLE users DROP COLUMN role`);
              await pool.query(`ALTER TABLE users RENAME COLUMN role_new TO role`);
              
              console.log('Role column successfully replaced with INTEGER type');
            } catch (innerError) {
              console.error('Failed to alter role column:', innerError);
            }
          }
        }
      }
    }

    // Show current schema
    const tableSchemaQuery = `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;
    
    const schemaResult = await pool.query(tableSchemaQuery);
    console.log('Current users table schema:');
    console.table(schemaResult.rows);

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