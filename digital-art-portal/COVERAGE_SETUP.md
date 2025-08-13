# Test Coverage Setup for SonarQube

## Quick Fix Commands

### Backend Coverage
```bash
cd backend
npm install
npm run test:coverage
```

### Frontend Coverage  
```bash
cd frontend
npm install
ng test --code-coverage --watch=false
```

## SonarQube Analysis
```bash
# From project root
sonar-scanner
```

## Expected Results
- **Backend**: 80%+ coverage on routes, models, middleware
- **Frontend**: 80%+ coverage on services and components
- **SonarQube**: Quality Gate should pass

## Files Created
- `backend/tests/` - Test files for all routes
- `frontend/src/app/**/*.spec.ts` - Angular test files
- `jest.config.js` - Backend test configuration
- `karma.conf.js` - Frontend test configuration
- `sonar-project.properties` - SonarQube settings

## Coverage Reports Location
- Backend: `backend/coverage/lcov.info`
- Frontend: `frontend/coverage/lcov.info`

Run the commands above to achieve 80%+ test coverage and pass SonarQube quality gate.