# Task Management API

A robust REST API for task management built with Express.js, TypeScript, and MongoDB.

## Features

- 🔐 Authentication & Authorization
  - User registration and login
  - JWT-based authentication
  - Role-based access control (Admin, Manager, User)
  - Password reset functionality
  - Refresh token mechanism

- 📋 Task Management
  - Create, read, update, and delete tasks
  - Assign tasks to multiple users
  - Task status tracking
  - Task history
  - Task comments
  - Due date management

- 🚀 Performance
  - Redis caching for faster responses
  - Pagination for task listings
  - BullMQ for background job processing

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **Cache:** Redis
- **Queue:** BullMQ
- **Validation:** Zod
- **Authentication:** JWT

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/task-management

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PW=

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /API/v1/auth/register` - Register a new user
- `POST /API/v1/auth/login` - Login user
- `POST /API/v1/auth/logout` - Logout user
- `POST /API/v1/auth/refresh-token` - Refresh access token
- `POST /API/v1/auth/forgot-password` - Request password reset
- `POST /API/v1/auth/reset-password` - Reset password
- `POST /API/v1/auth/change-password` - Change password
- `GET /API/v1/auth/me` - Get current user

### Tasks

- `GET /API/v1/tasks` - Get all tasks (with pagination)
- `GET /API/v1/tasks/:id` - Get task by ID
- `POST /API/v1/tasks` - Create new task
- `PUT /API/v1/tasks/:id` - Update task
- `DELETE /API/v1/tasks/:id` - Delete task

## Request/Response Examples

### Register User
```json
POST /API/v1/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "User"
}
```

### Create Task
```json
POST /API/v1/tasks
{
  "title": "Complete Project",
  "description": "Finish the task management API",
  "status": "Todo",
  "dueDate": "2024-03-20T00:00:00.000Z",
  "assignedTo": ["user1Id", "user2Id"]
}
```

## Error Handling

The API uses a consistent error response format:

```json
{
  "status": "error",
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## CI/CD Setup

### GitHub Actions Workflow

The project uses GitHub Actions for continuous integration and deployment. The workflow includes:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      # Add deployment steps here
```

### Deployment Environments

- **Development**: Local development environment
- **Staging**: Pre-production environment for testing
- **Production**: Live environment for end users

## Best Practices

### Code Quality

- **TypeScript Strict Mode**: Enabled for better type safety
- **ESLint & Prettier**: Code formatting and linting
- **Pre-commit Hooks**: Run tests and linting before commits
- **Code Reviews**: Required for all pull requests

### Security

- **Environment Variables**: Sensitive data stored in `.env`
- **Input Validation**: Zod schemas for request validation
- **Rate Limiting**: Implemented on all routes
- **CORS**: Configured for specific origins
- **Helmet**: Security headers enabled
- **JWT**: Token-based authentication with refresh mechanism

### Performance

- **Caching**: Redis for frequently accessed data
- **Pagination**: Implemented on list endpoints
- **Database Indexing**: Optimized for common queries
- **Background Jobs**: BullMQ for async tasks

### Testing

- **Unit Tests**: Jest for service and utility functions
- **Integration Tests**: Supertest for API endpoints
- **Test Coverage**: Minimum 80% coverage required
- **Mocking**: Jest mocks for external services

### Error Handling

- **Global Error Handler**: Centralized error management
- **Custom Error Classes**: Structured error responses
- **Logging**: Winston for structured logging
- **Monitoring**: Error tracking and performance monitoring

### Documentation

- **API Documentation**: OpenAPI/Swagger for endpoints
- **Code Comments**: JSDoc for complex functions
- **README**: Comprehensive setup and usage guide
- **CHANGELOG**: Version history and updates

### Git Workflow

- **Branch Naming**: feature/, bugfix/, hotfix/ prefixes
- **Commit Messages**: Conventional commits format
- **Version Control**: Semantic versioning
- **Release Process**: Automated release notes

### Monitoring & Logging

- **Application Metrics**: Performance monitoring
- **Error Tracking**: Sentry integration
- **Log Aggregation**: Centralized logging
- **Health Checks**: API health monitoring

## Development Guidelines

### Code Style

```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// Use type for unions and intersections
type UserRole = 'Admin' | 'Manager' | 'User';

// Use enums for constants
enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done'
}
```

### Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middlewares/    # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
├── validations/    # Request validation
└── types/          # TypeScript types
```

### Error Handling Pattern

```typescript
try {
  // Business logic
} catch (error) {
  if (error instanceof ApiError) {
    // Handle known API errors
  } else {
    // Handle unexpected errors
  }
  next(error);
}
```