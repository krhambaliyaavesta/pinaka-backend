#!/usr/bin/env ts-node
import { Pool, PoolClient } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables if .env exists
const envPath = path.join(__dirname, '..', '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config();
  console.log('Loaded environment variables from .env file');
}

interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionTimeoutMillis: number;
  ssl: {
    rejectUnauthorized: boolean;
  };
}

interface TableCount {
  table: string;
  records: number;
}

const config: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Nirupa@22',
  database: process.env.DB_NAME || 'auth_system',
  connectionTimeoutMillis: 5000,
  ssl: {
    rejectUnauthorized: false
  }
};

// Create a connection pool
const pool = new Pool(config);

// Test connection to database
async function testConnection(): Promise<boolean> {
  console.log('\n=== TESTING DATABASE CONNECTION ===');
  console.log(`Connecting to: ${config.user}@${config.host}:${config.port}/${config.database}`);
  
  try {
    const client: PoolClient = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL!');
    
    const result = await client.query('SELECT current_timestamp as now, current_user as user, version() as version');
    console.log('Database time:', result.rows[0].now);
    console.log('Connected as:', result.rows[0].user);
    console.log('PostgreSQL version:', result.rows[0].version);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', (error as Error).message);
    return false;
  }
}

// Show table schema
async function showTableSchema(): Promise<void> {
  console.log('\n=== DATABASE SCHEMA INFORMATION ===');
  
  try {
    // Get list of tables
    const tableListQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    const tableList = await pool.query(tableListQuery);
    
    if (tableList.rows.length === 0) {
      console.log('No tables found in database');
      return;
    }
    
    console.log(`Found ${tableList.rows.length} tables:`);
    
    // Loop through each table
    for (const tableRow of tableList.rows) {
      const tableName = tableRow.table_name;
      console.log(`\nTable: ${tableName}`);
      
      // Get column information
      const columnQuery = `
        SELECT 
          column_name, 
          data_type, 
          is_nullable, 
          column_default,
          character_maximum_length
        FROM 
          information_schema.columns
        WHERE 
          table_name = $1
        ORDER BY 
          ordinal_position;
      `;
      
      const result = await pool.query(columnQuery, [tableName]);
      console.table(result.rows);
    }
  } catch (error) {
    console.error('Error querying schema:', (error as Error).message);
  }
}

// Show record counts for tables
async function showTableCounts(): Promise<void> {
  console.log('\n=== TABLE RECORD COUNTS ===');
  
  try {
    // Get list of tables
    const tableListQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    const tableList = await pool.query(tableListQuery);
    
    if (tableList.rows.length === 0) {
      console.log('No tables found in database');
      return;
    }
    
    // Create an array to hold the count results
    const counts: TableCount[] = [];
    
    // Loop through each table to get counts
    for (const tableRow of tableList.rows) {
      const tableName = tableRow.table_name;
      const countQuery = `SELECT COUNT(*) as count FROM "${tableName}"`;
      const countResult = await pool.query(countQuery);
      
      counts.push({
        table: tableName,
        records: parseInt(countResult.rows[0].count, 10)
      });
    }
    
    console.table(counts);
  } catch (error) {
    console.error('Error querying table counts:', (error as Error).message);
  }
}

// Show help message
function showHelp(): void {
  console.log(`
Database Utility for Pinaka Backend

Usage:
  ts-node db-utility.ts [command]

Commands:
  test       - Test database connection
  schema     - Show table schema information
  count      - Show record counts for tables
  help       - Show this help message

By default, runs all commands if none specified.

Current configuration:
  Host:     ${config.host}
  Port:     ${config.port}
  User:     ${config.user}
  Database: ${config.database}
  `);
}

// Main function
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const commands = args.length > 0 ? args : ['test', 'schema', 'count'];
  
  try {
    // Process commands
    for (const cmd of commands) {
      switch (cmd.toLowerCase()) {
        case 'test':
          const success = await testConnection();
          if (!success) return; // Stop if connection fails
          break;
        case 'schema':
          await showTableSchema();
          break;
        case 'count':
          await showTableCounts();
          break;
        case 'help':
          showHelp();
          break;
        default:
          console.log(`Unknown command: ${cmd}`);
          showHelp();
          return;
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  } finally {
    // End the pool
    await pool.end();
  }
}

// Run the main function
main().catch(err => {
  console.error('Error in main:', err);
  process.exit(1);
}); 