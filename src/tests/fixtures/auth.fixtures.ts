import { UserProps } from "../../modules/auth/domain/entities/User";
import { ApprovalStatus } from "../../modules/auth/domain/entities/UserTypes";

// Valid test props for User creation
export const validUserProps: UserProps = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  email: "test@example.com",
  password: "password123",
  firstName: "John",
  lastName: "Doe",
  role: 3, // Member role
  jobTitle: "Software Engineer",
  approvalStatus: ApprovalStatus.PENDING,
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
};

// Tech Lead user props
export const techLeadUserProps: UserProps = {
  id: "123e4567-e89b-12d3-a456-426614174001",
  email: "lead@example.com",
  password: "password123",
  firstName: "Jane",
  lastName: "Smith",
  role: 2, // Lead role
  jobTitle: "Tech Lead",
  approvalStatus: ApprovalStatus.APPROVED,
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
};

// Admin user props
export const adminUserProps: UserProps = {
  id: "123e4567-e89b-12d3-a456-426614174002",
  email: "admin@example.com",
  password: "password123",
  firstName: "Admin",
  lastName: "User",
  role: 1, // Admin role
  jobTitle: "Administrator",
  approvalStatus: ApprovalStatus.APPROVED,
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
};

// Invalid user props (for testing validation)
export const invalidUserProps: Partial<UserProps>[] = [
  { ...validUserProps, email: "invalid-email" },
  { ...validUserProps, password: "123" }, // Too short
  { ...validUserProps, firstName: "" },
  { ...validUserProps, lastName: "" },
  { ...validUserProps, jobTitle: "" },
];

// Test user data (raw data format, as it would come from the database)
export const testUserData = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  email: "test@example.com",
  password: "$2a$10$ASD8Ah0UasVlGYZLF5sH8.YGI.FII3wq9yRBOJYcYTZ/6wdlN/JzG", // Hashed version of 'password123'
  first_name: "John",
  last_name: "Doe",
  role: 3,
  job_title: "Software Engineer",
  approval_status: ApprovalStatus.PENDING,
  created_at: new Date("2023-01-01"),
  updated_at: new Date("2023-01-01"),
};

// SignUp and SignIn DTOs for testing
export const signUpRequestDto = {
  email: "newuser@example.com",
  password: "password123",
  firstName: "New",
  lastName: "User",
  jobTitle: "Developer",
};

export const signInRequestDto = {
  email: "test@example.com",
  password: "password123",
};

export const jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjozLCJpYXQiOjE2MTk2MTI4MDAsImV4cCI6MTYxOTY5OTIwMH0.VgHIPvdInUQg6gJy5Jf2nPZSL4x7p0Tb5JxrnCwrfgM";

export const mockJwtPayload = {
  userId: "123e4567-e89b-12d3-a456-426614174000",
  email: "test@example.com",
  role: 3,
  iat: 1619612800,
  exp: 1619699200,
};
