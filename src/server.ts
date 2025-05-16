import app from './app';
import { config } from './config';
import { DBInitService } from './shared/services/DBInitService';

const PORT = config.server.port || 3000;

// Initialize the database and start the server
const startServer = async () => {
  try {
    // Initialize database tables
    await DBInitService.getInstance().initialize();
    
    // Log database information
    console.log(`Connected to PostgreSQL database at ${config.database.host}:${config.database.port}`);
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${config.server.env} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled rejections and exceptions
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
}); 