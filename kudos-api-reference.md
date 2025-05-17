# Kudos Card API Reference

This document provides a detailed reference of all API endpoints, their required request formats, and expected responses.

## Base URL

All endpoints are relative to the base URL: `http://localhost:3000/api`

## Authentication

### Register

Register a new user in the system.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Request Body**:

```json
{
  "email": "user@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "jobTitle": "Software Engineer"
}
```

- **Success Response**:

```json
{
  "status": "success",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "jobTitle": "Software Engineer",
    "role": 3,
    "approvalStatus": "PENDING",
    "createdAt": "2023-05-01T12:00:00Z"
  }
}
```

### Login

Login with email and password to get access token.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Request Body**:

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

- **Success Response**:

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": 3
    }
  }
}
```

## Teams

All team endpoints require authentication (Authorization: Bearer token).

### Get All Teams

Retrieve all teams in the system.

- **URL**: `/teams`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Success Response**:

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Engineering",
      "createdAt": "2023-05-01T12:00:00Z",
      "updatedAt": "2023-05-01T12:00:00Z"
    },
    {
      "id": 2,
      "name": "Product",
      "createdAt": "2023-05-01T12:00:00Z",
      "updatedAt": "2023-05-01T12:00:00Z"
    }
  ]
}
```

### Get Team by ID

Get a specific team by its ID.

- **URL**: `/teams/:id`
- **Method**: `GET`
- **URL Parameters**: `id=[integer]`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Success Response**:

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Engineering",
    "createdAt": "2023-05-01T12:00:00Z",
    "updatedAt": "2023-05-01T12:00:00Z"
  }
}
```

### Create Team

Create a new team (Admin only).

- **URL**: `/teams`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body**:

```json
{
  "name": "New Team"
}
```

- **Success Response**:

```json
{
  "status": "success",
  "data": {
    "id": 3,
    "name": "New Team",
    "createdAt": "2023-05-01T12:00:00Z",
    "updatedAt": "2023-05-01T12:00:00Z"
  }
}
```

### Update Team

Update an existing team (Admin only).

- **URL**: `/teams/:id`
- **Method**: `PUT`
- **URL Parameters**: `id=[integer]`
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body**:

```json
{
  "name": "Updated Team Name"
}
```

- **Success Response**:

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Updated Team Name",
    "createdAt": "2023-05-01T12:00:00Z",
    "updatedAt": "2023-05-01T13:00:00Z"
  }
}
```

### Delete Team

Delete a team (Admin only).

- **URL**: `/teams/:id`
- **Method**: `DELETE`
- **URL Parameters**: `id=[integer]`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Success Response**:

```json
{
  "status": "success",
  "data": null
}
```

## Categories

All category endpoints require authentication (Authorization: Bearer token).

### Get All Categories

Retrieve all categories in the system.

- **URL**: `/categories`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Success Response**:

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Teamwork",
      "createdAt": "2023-05-01T12:00:00Z",
      "updatedAt": "2023-05-01T12:00:00Z"
    },
    {
      "id": 2,
      "name": "Innovation",
      "createdAt": "2023-05-01T12:00:00Z",
      "updatedAt": "2023-05-01T12:00:00Z"
    }
  ]
}
```

### Get Category by ID

Get a specific category by its ID.

- **URL**: `/categories/:id`
- **Method**: `GET`
- **URL Parameters**: `id=[integer]`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Success Response**:

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Teamwork",
    "createdAt": "2023-05-01T12:00:00Z",
    "updatedAt": "2023-05-01T12:00:00Z"
  }
}
```

### Create Category

Create a new category (Admin only).

- **URL**: `/categories`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body**:

```json
{
  "name": "New Category"
}
```

- **Success Response**:

```json
{
  "status": "success",
  "data": {
    "id": 3,
    "name": "New Category",
    "createdAt": "2023-05-01T12:00:00Z",
    "updatedAt": "2023-05-01T12:00:00Z"
  }
}
```

### Update Category

Update an existing category (Admin only).

- **URL**: `/categories/:id`
- **Method**: `PUT`
- **URL Parameters**: `id=[integer]`
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body**:

```json
{
  "name": "Updated Category Name"
}
```

- **Success Response**:

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Updated Category Name",
    "createdAt": "2023-05-01T12:00:00Z",
    "updatedAt": "2023-05-01T13:00:00Z"
  }
}
```

### Delete Category

Delete a category (Admin only).

- **URL**: `/categories/:id`
- **Method**: `DELETE`
- **URL Parameters**: `id=[integer]`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Success Response**:

```json
{
  "status": "success",
  "data": null
}
```

## Kudos Cards

All kudos card endpoints require authentication (Authorization: Bearer token).

### Get All Kudos Cards

Retrieve all kudos cards with optional filtering.

- **URL**: `/kudos-cards`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Query Parameters**:
  - `recipientName=[string]` (optional)
  - `teamId=[integer]` (optional)
  - `categoryId=[integer]` (optional)
  - `startDate=[ISO date]` (optional)
  - `endDate=[ISO date]` (optional)
- **Success Response**:

```json
{
  "status": "success",
  "results": 2,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "recipientName": "Jane Smith",
      "teamId": 1,
      "teamName": "Engineering",
      "categoryId": 2,
      "categoryName": "Innovation",
      "message": "Thank you for your exceptional work on the project.",
      "createdBy": "abc-123-user-id",
      "creatorName": "John Doe",
      "createdAt": "2023-05-01T12:00:00Z",
      "updatedAt": "2023-05-01T12:00:00Z"
    },
    {
      "id": "567e4567-e89b-12d3-a456-426614174111",
      "recipientName": "Bob Johnson",
      "teamId": 2,
      "teamName": "Product",
      "categoryId": 1,
      "categoryName": "Teamwork",
      "message": "Great collaboration on the latest feature.",
      "createdBy": "abc-123-user-id",
      "creatorName": "John Doe",
      "createdAt": "2023-05-01T12:30:00Z",
      "updatedAt": "2023-05-01T12:30:00Z"
    }
  ]
}
```

### Get Kudos Card by ID

Get a specific kudos card by its ID.

- **URL**: `/kudos-cards/:id`
- **Method**: `GET`
- **URL Parameters**: `id=[UUID]`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Success Response**:

```json
{
  "status": "success",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "recipientName": "Jane Smith",
    "teamId": 1,
    "teamName": "Engineering",
    "categoryId": 2,
    "categoryName": "Innovation",
    "message": "Thank you for your exceptional work on the project.",
    "createdBy": "abc-123-user-id",
    "creatorName": "John Doe",
    "createdAt": "2023-05-01T12:00:00Z",
    "updatedAt": "2023-05-01T12:00:00Z"
  }
}
```

### Create Kudos Card

Create a new kudos card (Tech Lead or Admin only).

- **URL**: `/kudos-cards`
- **Method**: `POST`
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body**:

```json
{
  "recipientName": "Jane Smith",
  "teamId": 1,
  "categoryId": 2,
  "message": "Thank you for your exceptional work on the project. Your dedication and attention to detail made a huge difference!"
}
```

- **Success Response**:

```json
{
  "status": "success",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "recipientName": "Jane Smith",
    "teamId": 1,
    "teamName": "Engineering",
    "categoryId": 2,
    "categoryName": "Innovation",
    "message": "Thank you for your exceptional work on the project. Your dedication and attention to detail made a huge difference!",
    "createdBy": "abc-123-user-id",
    "creatorName": "John Doe",
    "createdAt": "2023-05-01T12:00:00Z",
    "updatedAt": "2023-05-01T12:00:00Z"
  }
}
```

### Update Kudos Card

Update an existing kudos card (Creator or Admin only).

- **URL**: `/kudos-cards/:id`
- **Method**: `PUT`
- **URL Parameters**: `id=[UUID]`
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Request Body** (all fields optional):

```json
{
  "recipientName": "Jane Smith",
  "teamId": 3,
  "categoryId": 4,
  "message": "Updated message: Thanks for your outstanding contribution to the project!"
}
```

- **Success Response**:

```json
{
  "status": "success",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "recipientName": "Jane Smith",
    "teamId": 3,
    "teamName": "Design",
    "categoryId": 4,
    "categoryName": "Problem Solving",
    "message": "Updated message: Thanks for your outstanding contribution to the project!",
    "createdBy": "abc-123-user-id",
    "creatorName": "John Doe",
    "createdAt": "2023-05-01T12:00:00Z",
    "updatedAt": "2023-05-01T13:00:00Z"
  }
}
```

### Delete Kudos Card

Soft delete a kudos card (Creator or Admin only).

- **URL**: `/kudos-cards/:id`
- **Method**: `DELETE`
- **URL Parameters**: `id=[UUID]`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Success Response**:

```json
{
  "status": "success",
  "data": null
}
```

## Analytics

All analytics endpoints require authentication (Authorization: Bearer token).

### Get Top Recipients

Get users who received the most kudos cards.

- **URL**: `/kudos-cards/analytics/top-recipients`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Query Parameters**:
  - `limit=[integer]` (optional, default: 10)
  - `period=[string]` (optional: daily, weekly, monthly, quarterly, yearly)
- **Success Response**:

```json
{
  "status": "success",
  "data": [
    {
      "recipientName": "Jane Smith",
      "count": 8
    },
    {
      "recipientName": "Bob Johnson",
      "count": 5
    },
    {
      "recipientName": "Alice Williams",
      "count": 3
    }
  ]
}
```

### Get Top Teams

Get teams that received the most kudos cards.

- **URL**: `/kudos-cards/analytics/top-teams`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Query Parameters**:
  - `limit=[integer]` (optional, default: 10)
  - `period=[string]` (optional: daily, weekly, monthly, quarterly, yearly)
- **Success Response**:

```json
{
  "status": "success",
  "data": [
    {
      "teamId": 1,
      "teamName": "Engineering",
      "count": 12
    },
    {
      "teamId": 2,
      "teamName": "Product",
      "count": 8
    },
    {
      "teamId": 3,
      "teamName": "Design",
      "count": 5
    }
  ]
}
```

### Get Trending Categories

Get most used categories in kudos cards.

- **URL**: `/kudos-cards/analytics/trending-categories`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Query Parameters**:
  - `limit=[integer]` (optional, default: 10)
  - `period=[string]` (optional: daily, weekly, monthly, quarterly, yearly)
- **Success Response**:

```json
{
  "status": "success",
  "data": [
    {
      "categoryId": 2,
      "categoryName": "Innovation",
      "count": 15
    },
    {
      "categoryId": 1,
      "categoryName": "Teamwork",
      "count": 10
    },
    {
      "categoryId": 4,
      "categoryName": "Problem Solving",
      "count": 7
    }
  ]
}
```

### Get Trending Keywords

Get most frequent keywords in kudos card messages.

- **URL**: `/kudos-cards/analytics/trending-keywords`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <token>`
- **Query Parameters**:
  - `limit=[integer]` (optional, default: 10)
  - `period=[string]` (optional: daily, weekly, monthly, quarterly, yearly)
- **Success Response**:

```json
{
  "status": "success",
  "data": [
    {
      "keyword": "teamwork",
      "count": 25
    },
    {
      "keyword": "innovation",
      "count": 18
    },
    {
      "keyword": "dedication",
      "count": 12
    },
    {
      "keyword": "collaboration",
      "count": 10
    }
  ]
}
```

## Error Responses

All endpoints follow the same error response format:

```json
{
  "status": "error",
  "message": "Error message explaining what went wrong"
}
```

### Common Error Codes

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions for the requested operation
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side error
