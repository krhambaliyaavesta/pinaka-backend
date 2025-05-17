# Interfaces Directory

This directory contains interfaces used by the application layer. These interfaces are used to define contracts that external entities must implement to interact with the application layer.

## Migration Plan

The kudosCards module is being restructured to follow the Clean Architecture pattern more strictly. The following changes are being made:

1. ✅ Create an interfaces directory in the application layer
2. ✅ Create proper interfaces for external services
3. ✅ Move DTOs and mappers into their respective use case directories
4. ⏳ Update all use cases to use the new DTOs and mappers
5. ⏳ Update all controllers to use the new factory pattern
6. ⏳ Remove the old DTOs and mappers once all use cases have been updated

## Interface Guidelines

- Interfaces should be named with an 'I' prefix (e.g., IKudosCardService)
- Interfaces should only define the methods that are required by the application layer
- Interfaces should be well-documented with JSDoc comments
- Interfaces should not contain implementation details 