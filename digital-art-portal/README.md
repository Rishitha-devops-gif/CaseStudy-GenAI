# Digital Art Submission Portal

A full-stack web application for artists to submit digital artworks and receive feedback from curators.

## Tech Stack

- **Frontend**: Angular 16 with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT-based login
- **Logging**: Winston
- **Testing**: Jest (Backend), Jasmine/Karma (Frontend)

## Features

- JWT-based authentication (login/logout)
- User registration for artists and curators
- CRUD operations for artworks
- Filterable artwork gallery
- Curator feedback system
- Form validation for all inputs
- Error handling with user-friendly messages
- Comprehensive logging
- Unit tests for critical components

## Setup Instructions

### Database Setup

1. Install PostgreSQL
2. Create database and run schema:
```bash
psql -U postgres
\i backend/database.sql
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
ng serve
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Artworks
- `GET /api/artworks` - Get all artworks (with optional tag filtering)
- `GET /api/artworks/:id` - Get specific artwork
- `POST /api/artworks` - Create artwork (authenticated)
- `PUT /api/artworks/:id` - Update artwork (authenticated)
- `DELETE /api/artworks/:id` - Delete artwork (authenticated)

### Feedback
- `GET /api/feedback/artwork/:artworkId` - Get feedback for artwork
- `POST /api/feedback` - Create feedback (curator only)
- `PUT /api/feedback/:id` - Update feedback (authenticated)
- `DELETE /api/feedback/:id` - Delete feedback (authenticated)

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
ng test
```

## Environment Variables

Create `.env` file in backend directory:
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=digital_art_portal
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```