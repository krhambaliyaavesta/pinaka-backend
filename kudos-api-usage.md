# Kudos Card API - Postman Collection Guide

This document provides instructions on how to use the Postman collection for testing the Kudos Card API.

## Getting Started

1. Download and install [Postman](https://www.postman.com/downloads/) if you haven't already.
2. Import the `kudos-postman-collection.json` file into Postman:
   - Click on "Import" in the top left corner
   - Select the JSON file or drag and drop it
   - Click "Import" to add the collection to your workspace

## Setting Up Environment Variables

The collection uses two environment variables:

- `baseUrl`: The base URL of your API server (default: http://localhost:3000)
- `token`: The JWT authentication token obtained after login

To set up these variables:

1. Click on "Environments" in the left sidebar
2. Click the "+" icon to create a new environment
3. Name it "Kudos Card API"
4. Add the variables:
   - `baseUrl`: Set to your API server URL (e.g., http://localhost:3000)
   - `token`: Leave empty for now (will be populated after login)
5. Click "Save"
6. Select your new environment from the dropdown in the top right corner

## Authentication Flow

Before accessing most endpoints, you need to authenticate:

1. Register a new user (if you don't have an account):

   - Use the "Register" request in the Authentication folder
   - Fill in valid user details (email, password, firstName, lastName, jobTitle)
   - Send the request

2. Login to get an authentication token:
   - Use the "Login" request in the Authentication folder
   - Enter your email and password
   - Send the request
   - From the response, copy the token (usually in `data.token`)
   - Set it as the value for the `token` environment variable

## Testing the APIs

### Teams API

- **Get All Teams**: Retrieves all teams in the system
- **Get Team by ID**: Gets a specific team by its ID (replace "1" with the actual team ID)
- **Create Team** (Admin only): Creates a new team
- **Update Team** (Admin only): Updates an existing team (replace "1" with the actual team ID)
- **Delete Team** (Admin only): Deletes a team (replace "1" with the actual team ID)

### Categories API

- **Get All Categories**: Retrieves all categories
- **Get Category by ID**: Gets a specific category (replace "1" with the actual category ID)
- **Create Category** (Admin only): Creates a new category
- **Update Category** (Admin only): Updates an existing category (replace "1" with the actual category ID)
- **Delete Category** (Admin only): Deletes a category (replace "1" with the actual category ID)

### Kudos Cards API

- **Get All Kudos Cards**: Retrieves all kudos cards with optional filtering
  - Optional query parameters: recipientName, teamId, categoryId, startDate, endDate
- **Get Kudos Card by ID**: Gets a specific kudos card (replace the UUID with the actual kudos card ID)
- **Create Kudos Card** (Tech Lead or Admin only): Creates a new kudos card
- **Update Kudos Card** (Creator or Admin only): Updates an existing kudos card (replace the UUID with the actual kudos card ID)
- **Delete Kudos Card** (Creator or Admin only): Soft deletes a kudos card (replace the UUID with the actual kudos card ID)

### Analytics API

- **Get Top Recipients**: Gets users who received the most kudos cards
  - Optional query parameters: limit (default: 10), period (daily, weekly, monthly, quarterly, yearly)
- **Get Top Teams**: Gets teams that received the most kudos cards
  - Optional query parameters: limit, period
- **Get Trending Categories**: Gets most used categories in kudos cards
  - Optional query parameters: limit, period
- **Get Trending Keywords**: Gets most frequent keywords in kudos card messages
  - Optional query parameters: limit, period

## Role-Based Access

The API implements role-based access control:

- **Admin users** (role = 1): Can perform all operations
- **Tech Lead users** (role = 2): Can create, view, update, and delete kudos cards (but only their own)
- **Team Member users** (role = 3): Can only view kudos cards

Ensure you're using accounts with appropriate permissions when testing restricted endpoints.

## Response Format

All responses follow a standard format:

```json
{
  "status": "success" | "error",
  "data": {...} | null,  // For success responses
  "message": "..."       // For error responses
}
```

For collection endpoints, the response might include a `results` count:

```json
{
  "status": "success",
  "results": 5,
  "data": [...]
}
```

## Error Handling

If you encounter errors:

1. Check that you're using the correct HTTP method
2. Verify your request body matches the expected format
3. Ensure you have the appropriate permissions for the endpoint
4. Check that your authentication token is valid and correctly set
5. Look at the error message in the response for more specific information
