#!/bin/bash

# Create directory structure for both modules
mkdir -p src/tests/unit/kudosCards/{domain,application,infrastructure,presentation}/{entities,valueObjects,repositories,useCases,controllers} 2>/dev/null
mkdir -p src/tests/unit/auth/{domain,application,infrastructure,presentation}/{entities,valueObjects,repositories,useCases,controllers} 2>/dev/null

# Move KudosCard related tests
cp -n src/tests/unit/domain/entities/KudosCard.test.ts src/tests/unit/kudosCards/domain/entities/ 2>/dev/null
cp -n src/tests/unit/domain/entities/Category.test.ts src/tests/unit/kudosCards/domain/entities/ 2>/dev/null
cp -n src/tests/unit/domain/entities/Team.test.ts src/tests/unit/kudosCards/domain/entities/ 2>/dev/null
cp -n src/tests/unit/application/useCases/kudosCard/CreateKudosCardUseCase.test.ts src/tests/unit/kudosCards/application/useCases/ 2>/dev/null
cp -n src/tests/unit/infrastructure/repositories/KudosCardRepoPgImpl.test.ts src/tests/unit/kudosCards/infrastructure/repositories/ 2>/dev/null
cp -n src/tests/unit/presentation/controllers/KudosCardController.test.ts src/tests/unit/kudosCards/presentation/controllers/ 2>/dev/null

# Move Auth related tests
cp -n src/tests/unit/domain/entities/User.test.ts src/tests/unit/auth/domain/entities/ 2>/dev/null
cp -n src/tests/unit/application/useCases/signIn/SignInUseCase.test.ts src/tests/unit/auth/application/useCases/ 2>/dev/null
cp -n src/tests/unit/infrastructure/repositories/UserRepoPgImpl.test.ts src/tests/unit/auth/infrastructure/repositories/ 2>/dev/null
cp -n src/tests/unit/presentation/controllers/AuthController.test.ts src/tests/unit/auth/presentation/controllers/ 2>/dev/null

# Verify all tests are properly moved
echo "Verifying KudosCards module tests:"
ls -la src/tests/unit/kudosCards/domain/entities/
ls -la src/tests/unit/kudosCards/application/useCases/
ls -la src/tests/unit/kudosCards/infrastructure/repositories/
ls -la src/tests/unit/kudosCards/presentation/controllers/

echo "Verifying Auth module tests:"
ls -la src/tests/unit/auth/domain/entities/
ls -la src/tests/unit/auth/application/useCases/
ls -la src/tests/unit/auth/infrastructure/repositories/
ls -la src/tests/unit/auth/presentation/controllers/

echo "Reorganization complete!"
