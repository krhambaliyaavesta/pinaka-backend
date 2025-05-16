# Pinaka Backend

This is the backend component of the Pinaka project, built with:
- Node.js and Express
- TypeScript
- PostgreSQL database
- Clean architecture design principles

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Copy `.env.example` to `.env` if it exists, or create a new `.env` file
- Set the proper PostgreSQL connection details

3. Start the development server:
```bash
npm run dev
```
Or use the start script:
```bash
./start.sh
```

## Database

The application uses PostgreSQL. To check the database schema:
```bash
node show-table-schema.js
```

## Project Structure

```
src/
├── config/                  # Application configuration
├── modules/                 # Feature modules
│   ├── users/              
│   │   ├── domain/          # Business entities and rules
│   │   │   ├── entities/
│   │   │   ├── repositories/ # Repository interfaces
│   │   │   └── valueObjects/
│   │   ├── application/     # Use cases and application logic
│   │   │   ├── dtos/
│   │   │   └── useCases/
│   │   ├── infrastructure/  # Technical implementation details
│   │   │   └── repositories/ # Repository implementations
│   │   └── presentation/    # API controllers and routes
│   │       ├── controllers/
│   │       |
│   │       └── routes/
│   └── [other-modules]/     # Other business domains following same structure
├── shared/                  # Shared utilities and helpers
│   ├── errors/
│   |
│   └── utils/
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── app.ts                   # Express application setup
└── server.ts                # Server entry point
```

## Architecture Overview

This project follows the clean architecture pattern with the following layers:

1. **Domain Layer**: Contains business entities, repository interfaces, and business rules.
2. **Application Layer**: Contains use cases that orchestrate the flow of data to and from entities.
3. **Infrastructure Layer**: Implements interfaces defined in the domain layer (database access, external services).
4. **Presentation Layer**: Contains controllers and routes for the API endpoints.

## Core Dependencies

- Node.js
- Express.js
- TypeScript
- Jest (for testing)
- Supertest (for API testing)
- ESLint & Prettier (for code quality)
- mysql (choose your database)

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd <project-name>
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Configure environment variables
   ```
   cp .env.example .env
   ```

4. Start development server
   ```
   npm run dev
   ```

### Scripts

- `npm run build` - Builds the project
- `npm run start` - Starts the production server
- `npm run dev` - Starts the development server
- `npm run test` - Runs all tests
- `npm run test:unit` - Runs unit tests
- `npm run test:integration` - Runs integration tests
- `npm run test:e2e` - Runs end-to-end tests
- `npm run lint` - Lints the code
- `npm run lint:fix` - Fixes linting issues

## Testing Strategy

### Unit Tests

Unit tests focus on testing individual functions and classes in isolation. Each unit test should:
- Target a specific function or method
- Mock dependencies
- Verify the function produces the expected output

### Integration Tests

Integration tests verify that different components work together correctly:
- Test the interaction between repositories and databases
- Verify use cases with their dependencies
- Test multiple units as a group

### End-to-End Tests

E2E tests verify the entire application flow:
- Test API endpoints
- Simulate user interactions
- Verify the entire system works together

## Development Guidelines

### Folder Structure

Each module should follow the clean architecture pattern:

1. **Domain**
   - Entities: Business objects with methods
   - Value Objects: Small immutable objects
   - Repository Interfaces: Data access contracts

2. **Application**
   - Use Cases: Application-specific business rules
   - DTOs: Data Transfer Objects for input/output

3. **Infrastructure**
   - Repository implementations
   - Database models
   - External service clients

4. **Presentation**
   - Controllers: Handle HTTP requests
   - Routes: Define API endpoints
   - Middlewares: Request processing logic

### Dependency Rule

Dependencies should only point inward:
- Domain layer has no dependencies
- Application layer depends only on Domain
- Infrastructure layer depends on Domain and Application
- Presentation layer depends on Application

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

# pinaka
