/**
 * Script to initialize the Kudos Card database tables
 * This script creates the necessary tables, indexes, and default data for the Kudos Card system
 */

import fs from "fs";
import path from "path";
import { DatabaseServiceFactory } from "../shared/services/DatabaseServiceFactory";
import { DBInitService } from "../shared/services/DBInitService";

// Function to run the migration
async function runMigration() {
  try {
    // Initialize DB connection
    await DBInitService.getInstance().initialize();
    console.log("Database connection established");

    // Read the SQL migration file
    const sqlFilePath = path.join(__dirname, "kudos-migration.sql");
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

    // Split into individual statements (roughly)
    const statements = sqlContent
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Get database service
    const db = DatabaseServiceFactory.getDatabase();

    // Execute each statement
    console.log(
      `Running Kudos Card migration with ${statements.length} statements...`
    );
    for (const statement of statements) {
      await db.query(statement);
    }

    console.log(
      "Kudos Card tables, indexes, and default data created successfully"
    );
    process.exit(0);
  } catch (error) {
    console.error("Error initializing Kudos Card database:", error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
