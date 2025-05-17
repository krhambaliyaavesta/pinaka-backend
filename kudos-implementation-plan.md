# Kudos Card System Implementation Plan

## Overview and Purpose

### What is a Kudos Card System?

A Kudos Card System is a digital platform that enables recognition and appreciation among team members in an organization. It allows colleagues to publicly acknowledge each other's contributions through digital "appreciation cards", fostering a positive work culture and boosting morale. The term "kudos" comes from the Greek word for "glory" or "renown", and the card concept makes the recognition tangible, similar to physical thank-you or appreciation cards.

### Why Build a Kudos Card System?

1. **Foster a Culture of Appreciation**: Regular recognition of good work creates a positive workplace environment where employees feel valued.
2. **Increase Team Morale**: Public acknowledgment of efforts boosts morale and motivation.
3. **Reinforce Positive Behaviors**: Recognizing specific actions or qualities encourages their repetition.
4. **Improve Team Cohesion**: Expressing gratitude strengthens relationships between team members.
5. **Provide Performance Insights**: The analytics component offers insights into team dynamics and individual contributions.

### Key Features and Their Purpose

**1. Role-Based Access**

- **What**: Different access levels for different user roles (admin, tech lead, team member)
- **Why**: Ensures appropriate permissions based on organizational hierarchy while maintaining data integrity

**2. Teams and Categories Management**

- **What**: Predefined lists of teams and categories for kudos card classification
- **Why**: Provides structure and consistency in recognition, enables effective filtering and analytics

**3. Kudos Card Creation and Management**

- **What**: Interface for creating, viewing, editing, and deleting digital appreciation cards
- **Why**: Core functionality that enables the act of recognition with appropriate content moderation

**4. Filtering and Search**

- **What**: Ability to filter kudos cards by recipient, team, category, and date range
- **Why**: Makes the system more usable as the kudos card wall grows, allowing users to find relevant recognitions

**5. Analytics Dashboard**

- **What**: Visual representation of kudos card data showing trends and patterns
- **Why**: Provides organizational insights about recognition patterns, identifies top contributors, and highlights trending values

## Database Structure

### Current Database Tables

**1. Users Table**

- `id` (UUID, primary key) - generated with uuid_generate_v4()
- `email` (VARCHAR, not null)
- `password` (VARCHAR, not null)
- `first_name` (VARCHAR, not null)
- `last_name` (VARCHAR, not null)
- `created_at` (TIMESTAMP, not null)
- `updated_at` (TIMESTAMP, not null)
- `deleted_at` (TIMESTAMP, nullable)
- `role` (INTEGER, references roles table)
- `job_title` (VARCHAR, nullable)
- `approval_status` (ENUM: PENDING, APPROVED, REJECTED, default: PENDING)

**2. Roles Table**

- `id` (INTEGER, primary key)
- `role_name` (VARCHAR(50), not null, unique)

**Current Role Values:**

1. admin
2. lead (Tech Lead - can create and view kudos cards)
3. member (Team Member - can only view kudos cards)

### New Tables for Kudos Card System

**1. Teams Table**

- **Purpose**: Stores predefined teams in the organization to categorize kudos cards by department or functional area
- **Benefits**: Enables filtering by team and analytics on team performance/recognition

```sql
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**2. Categories Table**

- **Purpose**: Stores predefined categories of recognition (e.g., Teamwork, Innovation) to classify the type of achievement
- **Benefits**: Allows for trend analysis on the types of behaviors being recognized most frequently

```sql
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**3. Kudos Cards Table**

- **Purpose**: The core table storing all digital kudos cards with references to teams, categories, and users
- **Benefits**: Centralized storage of all recognition data with appropriate relationships for querying

```sql
CREATE TABLE IF NOT EXISTS kudos_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_name VARCHAR(255) NOT NULL,
  team_id INTEGER NOT NULL REFERENCES teams(id),
  category_id INTEGER NOT NULL REFERENCES categories(id),
  message TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

**Default Teams Data:**
These predefined teams cover the major departments typically found in organizations, providing a starting point for team-based recognition.

- Engineering
- Product
- Design
- Marketing
- Sales
- Customer Support
- Operations
- Human Resources
- Finance

**Default Categories Data:**
These categories represent common types of recognition, focusing on both collaborative and individual achievements.

- Teamwork
- Innovation
- Helping Hand
- Problem Solving
- Leadership
- Customer Focus
- Quality Work
- Above and Beyond

## Clean Architecture Implementation

### Why Use Clean Architecture?

Clean Architecture separates the application into distinct layers with clear responsibilities, making the codebase:

- More maintainable and testable
- Easier to extend with new features
- Less dependent on external frameworks
- More resilient to changes in business requirements
- Better organized with clear separation of concerns

Each layer communicates with adjacent layers through well-defined interfaces, ensuring that changes in one layer have minimal impact on others.

### 1. Domain Layer

**Purpose**: The core of the application, containing business entities and interface definitions independent of any external concerns.

**Benefits**:

- Represents the fundamental business concepts
- Remains stable despite changes in other layers
- Contains no dependencies on frameworks or external libraries

**Entities**

- **Team Entity**
  - **Purpose**: Represents a department or functional team within the organization
  - **Usage**: Referenced when creating kudos cards to associate recognition with specific teams

```typescript
export interface Team {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

- **Category Entity**
  - **Purpose**: Represents a type of recognition or achievement
  - **Usage**: Used to classify kudos cards for better organization and analysis

```typescript
export interface Category {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

- **KudosCard Entity**
  - **Purpose**: Represents a single digital appreciation card created by one user for another
  - **Usage**: The core data structure of the application, containing all details of a recognition

```typescript
export interface KudosCard {
  id: string;
  recipientName: string;
  teamId: number;
  categoryId: number;
  message: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

**Repository Interfaces**

- **Purpose**: Define contracts for data access without specifying implementation details
- **Benefits**: Enable dependency inversion and make business logic independent of data access mechanisms

- **Team Repository Interface**
  - **Purpose**: Defines operations for team data management
  - **Usage**: Used by application layer to access and manipulate team data

```typescript
export interface TeamRepository {
  findAll(): Promise<Team[]>;
  findById(id: number): Promise<Team | null>;
  create(team: Omit<Team, "id" | "createdAt" | "updatedAt">): Promise<Team>;
  update(id: number, team: Partial<Team>): Promise<Team | null>;
  delete(id: number): Promise<boolean>;
}
```

- **Category Repository Interface**
  - **Purpose**: Defines operations for category data management
  - **Usage**: Used by application layer to access and manipulate category data

```typescript
export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  create(
    category: Omit<Category, "id" | "createdAt" | "updatedAt">
  ): Promise<Category>;
  update(id: number, category: Partial<Category>): Promise<Category | null>;
  delete(id: number): Promise<boolean>;
}
```

- **KudosCard Repository Interface**
  - **Purpose**: Defines operations for kudos card data management and complex queries
  - **Usage**: Used by application layer to access, manipulate, and analyze kudos card data

```typescript
export interface KudosCardRepository {
  findAll(filters?: KudosCardFilters): Promise<KudosCard[]>;
  findById(id: string): Promise<KudosCard | null>;
  create(
    kudosCard: Omit<KudosCard, "id" | "createdAt" | "updatedAt" | "deletedAt">
  ): Promise<KudosCard>;
  update(id: string, kudosCard: Partial<KudosCard>): Promise<KudosCard | null>;
  delete(id: string): Promise<boolean>;
  getTopRecipients(
    limit: number,
    period?: string
  ): Promise<{ recipientName: string; count: number }[]>;
  getTopTeams(
    limit: number,
    period?: string
  ): Promise<{ teamId: number; teamName: string; count: number }[]>;
  getTrendingCategories(
    limit: number,
    period?: string
  ): Promise<{ categoryId: number; categoryName: string; count: number }[]>;
}

export interface KudosCardFilters {
  recipientName?: string;
  teamId?: number;
  categoryId?: number;
  startDate?: Date;
  endDate?: Date;
  createdBy?: string;
}
```

### 2. Application Layer

**Purpose**: Contains the application's use cases and orchestrates the flow of data between the domain and infrastructure layers.

**Benefits**:

- Implements business rules specific to application requirements
- Coordinates data flow and transformation
- Remains independent of external frameworks and UI concerns

**DTOs (Data Transfer Objects)**

- **Purpose**: Facilitate data transfer between layers with specific structures for each operation
- **Benefits**:

  - Decouple internal data structures from external APIs
  - Provide clear validation boundaries
  - Enable versioning of APIs without changing domain entities

- **Team DTOs**
  - **Purpose**: Define data structures for team-related operations
  - **Usage**: Used in controllers to receive input and format output

```typescript
export interface TeamDTO {
  id: number;
  name: string;
}

export interface CreateTeamDTO {
  name: string;
}

export interface UpdateTeamDTO {
  name?: string;
}
```

- **Category DTOs**
  - **Purpose**: Define data structures for category-related operations
  - **Usage**: Used in controllers to receive input and format output

```typescript
export interface CategoryDTO {
  id: number;
  name: string;
}

export interface CreateCategoryDTO {
  name: string;
}

export interface UpdateCategoryDTO {
  name?: string;
}
```

- **KudosCard DTOs**
  - **Purpose**: Define data structures for kudos card-related operations with enriched data
  - **Usage**: Used in controllers to receive input and format output with related entity information

```typescript
export interface KudosCardDTO {
  id: string;
  recipientName: string;
  teamId: number;
  teamName: string;
  categoryId: number;
  categoryName: string;
  message: string;
  createdBy: string;
  creatorName: string;
  createdAt: Date;
}

export interface CreateKudosCardDTO {
  recipientName: string;
  teamId: number;
  categoryId: number;
  message: string;
}

export interface UpdateKudosCardDTO {
  recipientName?: string;
  teamId?: number;
  categoryId?: number;
  message?: string;
}

export interface KudosCardFilterDTO {
  recipientName?: string;
  teamId?: number;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
}
```

**Use Cases**

- **Purpose**: Implement application-specific business rules and orchestrate operations
- **Benefits**:

  - Contain the logic for specific application features
  - Coordinate between multiple repositories when needed
  - Apply business rules consistently

- **Team Use Cases**: Manage team data with proper validation and error handling
- **Category Use Cases**: Manage category data with proper validation and error handling
- **KudosCard Use Cases**: Implement the core business logic for creating, retrieving, updating, and deleting kudos cards
- **Analytics Use Cases**: Implement business logic for generating analytical insights from kudos card data

### 3. Infrastructure Layer

**Purpose**: Provides concrete implementations of interfaces defined in the domain layer.

**Benefits**:

- Contains all external dependencies (database, external services)
- Isolates the rest of the application from implementation details
- Makes the system more testable through abstraction

**Repository Implementations**

- **Purpose**: Implement data access logic for domain entities
- **Benefits**:

  - Encapsulate database-specific code
  - Handle data persistence concerns
  - Convert between database models and domain entities

- **PostgreSQL implementations for Team, Category, and KudosCard repositories**:
  - Implement SQL queries to retrieve, create, update, and delete records
  - Handle database-specific error cases
  - Implement transaction management when needed

### 4. Presentation Layer

**Purpose**: Handles HTTP requests, formats responses, and manages API endpoints.

**Benefits**:

- Provides a clean interface for clients
- Handles input validation
- Manages authentication and authorization
- Formats responses according to API standards

**Routes**

- **Purpose**: Define API endpoints and HTTP methods
- **Benefits**:
  - Organize endpoints logically
  - Apply middleware for common concerns
  - Handle routing parameters

1. **Teams Routes**

   - **Purpose**: Manage team data through RESTful endpoints
   - **Benefits**: Provide consistent interface for team operations

   - `GET /api/teams` - Get all teams
   - `GET /api/teams/:id` - Get single team
   - `POST /api/teams` - Create team (admin only)
   - `PUT /api/teams/:id` - Update team (admin only)
   - `DELETE /api/teams/:id` - Delete team (admin only)

2. **Categories Routes**

   - **Purpose**: Manage category data through RESTful endpoints
   - **Benefits**: Provide consistent interface for category operations

   - `GET /api/categories` - Get all categories
   - `GET /api/categories/:id` - Get single category
   - `POST /api/categories` - Create category (admin only)
   - `PUT /api/categories/:id` - Update category (admin only)
   - `DELETE /api/categories/:id` - Delete category (admin only)

3. **Kudos Card Routes**

   - **Purpose**: Manage kudos card data through RESTful endpoints
   - **Benefits**: Provide consistent interface for the core kudos card operations

   - `GET /api/kudos-cards` - Get all kudos cards with filtering
   - `GET /api/kudos-cards/:id` - Get single kudos card
   - `POST /api/kudos-cards` - Create kudos card (lead role only)
   - `PUT /api/kudos-cards/:id` - Update kudos card (lead role only, creator)
   - `DELETE /api/kudos-cards/:id` - Delete kudos card (lead role only, creator)

4. **Analytics Routes**

   - **Purpose**: Provide analytical insights through specialized endpoints
   - **Benefits**: Support dashboard visualization with aggregated data

   - `GET /api/analytics/kudos-cards/top-recipients` - Get top recognized individuals
   - `GET /api/analytics/kudos-cards/top-teams` - Get top recognized teams
   - `GET /api/analytics/kudos-cards/trending-categories` - Get trending categories
   - `GET /api/analytics/kudos-cards/trending-keywords` - Get trending keywords

**Controllers**

- **Purpose**: Handle HTTP requests, invoke use cases, and format responses
- **Benefits**:

  - Separate routing from business logic
  - Handle HTTP-specific concerns
  - Format responses consistently

- **Team Controller**: Process team-related HTTP requests
- **Category Controller**: Process category-related HTTP requests
- **KudosCard Controller**: Process kudos card-related HTTP requests
- **Analytics Controller**: Process analytics-related HTTP requests

**Middleware**

- **Purpose**: Implement cross-cutting concerns that apply to multiple routes
- **Benefits**:

  - Reuse common functionality across routes
  - Apply consistent processing to requests

- **Authorization middleware**: Check user roles for access control
- **Validation middleware**: Validate input data before processing

## Implementation Steps

1. **Database Setup**

   - **Purpose**: Establish the data persistence layer
   - **Tasks**:
     - Run migration script to create tables
     - Populate reference data (teams, categories)

2. **Domain Layer Implementation**

   - **Purpose**: Define the core business concepts
   - **Tasks**:
     - Define entities
     - Define repository interfaces

3. **Infrastructure Layer Implementation**

   - **Purpose**: Implement data access mechanisms
   - **Tasks**:
     - Create PostgreSQL repository implementations
     - Implement query builders for complex queries

4. **Application Layer Implementation**

   - **Purpose**: Implement business logic and use cases
   - **Tasks**:
     - Create DTOs for data transfer
     - Implement use cases for business logic
     - Create mappers for entity-DTO conversions

5. **Presentation Layer Implementation**

   - **Purpose**: Create the API interface
   - **Tasks**:
     - Create controller classes for request handling
     - Define routes for API endpoints
     - Implement validation middleware
     - Implement authorization middleware

6. **Testing**

   - **Purpose**: Ensure system quality and correctness
   - **Tasks**:
     - Write unit tests for individual components
     - Write integration tests for API endpoints

7. **Documentation**
   - **Purpose**: Make the system understandable and maintainable
   - **Tasks**:
     - Create API documentation
     - Document code with JSDoc comments

## Analytics Functionality

The analytics dashboard provides insights into kudos card activity, helping managers identify trends and patterns in recognition:

1. **Top Recipients**

   - **Purpose**: Identify individuals receiving the most recognition cards
   - **Implementation**: Query that counts kudos cards by recipient name
   - **Features**: Option to filter by period (weekly, monthly, quarterly, yearly)
   - **Value**: Highlights team members who are consistently recognized by peers

2. **Top Teams**

   - **Purpose**: Identify teams receiving the most recognition cards
   - **Implementation**: Query that counts kudos cards by team
   - **Features**: Option to filter by period
   - **Value**: Provides insights into which teams are being most recognized, possibly indicating high performance

3. **Trending Categories**

   - **Purpose**: Identify the most common types of recognition on cards
   - **Implementation**: Query that counts kudos cards by category
   - **Features**: Option to filter by period
   - **Value**: Shows which values or behaviors are most frequently recognized in the organization

4. **Trending Keywords**
   - **Purpose**: Identify common themes in kudos card messages
   - **Implementation**: Full-text search on message field to extract common terms
   - **Features**: Option to filter by period
   - **Value**: Reveals emerging themes or topics in recognition that may not be captured by predefined categories

## Soft Delete Implementation

The kudos_cards table includes a `deleted_at` timestamp field which enables soft delete functionality. When this field is populated with a timestamp, it indicates the record has been soft-deleted and should be excluded from standard queries.

**Implementation**:

- When "deleting" a kudos card, set the `deleted_at` timestamp rather than removing the record
- Repository methods should include a WHERE clause to filter out records where `deleted_at IS NOT NULL`
- This approach preserves data for analytics and audit purposes while allowing "deletion" from the user perspective
- Administrators can have access to view or restore soft-deleted records if needed

This simple approach maintains data integrity while still respecting user expectations around deletion.
