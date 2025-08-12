# Digital Art Portal - Complete Setup Guide

## Prerequisites
1. **Node.js** (v16+) - Download from https://nodejs.org/
2. **PostgreSQL** - Download from https://www.postgresql.org/download/
3. **Angular CLI** - Install globally: `npm install -g @angular/cli`

## Step 1: Database Setup

### Option A: Using pgAdmin (Recommended)
1. Open **pgAdmin** (installed with PostgreSQL)
2. Connect to PostgreSQL server with your password
3. Right-click "Databases" → Create → Database
4. Name: `digital_art_portal`
5. Open the database → Tools → Query Tool
6. Copy and paste this SQL:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'artist' CHECK (role IN ('artist', 'curator')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artworks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  tags TEXT,
  artist_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE feedback (
  id SERIAL PRIMARY KEY,
  artwork_id INTEGER REFERENCES artworks(id) ON DELETE CASCADE,
  curator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_artworks_artist_id ON artworks(artist_id);
CREATE INDEX idx_feedback_artwork_id ON feedback(artwork_id);
```

7. Click Execute (F5)

### Option B: Using Command Line
```bash
psql -U postgres -c "CREATE DATABASE digital_art_portal;"
psql -U postgres -d digital_art_portal -f backend/database.sql
```

## Step 2: Backend Setup

1. **Navigate to backend folder:**
```bash
cd digital-art-portal/backend
```

2. **Create .env file** with your PostgreSQL password:
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=digital_art_portal
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=your-secret-key
```

3. **Install dependencies:**
```bash
npm install
```

4. **Start backend server:**
```bash
npm start
```

**Expected output:** `{"level":"info","message":"Server running on port 3000"}`

## Step 3: Frontend Setup

1. **Open new terminal and navigate to frontend:**
```bash
cd digital-art-portal/frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start frontend server:**
```bash
ng serve
```

**Expected output:** `Angular Live Development Server is listening on localhost:4200`

## Step 4: Access Application

1. **Open browser:** http://localhost:4200
2. **Backend API:** http://localhost:3000 (should show: `{"message":"Digital Art Portal API is running!"}`)

## Step 5: Test the Application

### Register Users:
1. Click **"Register"**
2. Create **Artist account:**
   - Username: `john_artist`
   - Email: `john@test.com`
   - Password: `password123`
   - Role: `Artist`

3. Create **Curator account:**
   - Username: `mary_curator`
   - Email: `mary@test.com`
   - Password: `password123`
   - Role: `Curator`

### Test Features:

#### As Artist:
1. **Login** with artist credentials
2. **Add Artwork:**
   - Title: `Digital Sunset`
   - Description: `Beautiful digital art`
   - Image URL: `https://picsum.photos/400/280?random=1`
   - Tags: `digital, art, sunset`
3. **View Reviews** - Click "View Reviews" button
4. **Edit/Delete** your artworks

#### As Curator:
1. **Login** with curator credentials
2. **View artworks** created by artists
3. **Add Reviews:**
   - Click "Add Review" on any artwork
   - Select rating (1-5 stars)
   - Write professional feedback
   - Submit review

### Sample Image URLs for Testing:
- `https://picsum.photos/400/280?random=1`
- `https://picsum.photos/400/280?random=2`
- `https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=280&fit=crop`
- `https://via.placeholder.com/400x280/4CAF50/ffffff?text=Digital+Art`

## Troubleshooting

### Backend Issues:
- **"Cannot GET /"** → Backend not running, restart with `npm start`
- **Database connection error** → Check PostgreSQL is running and .env password is correct
- **Port 3000 in use** → Kill process or change PORT in .env

### Frontend Issues:
- **Compilation errors** → Run `npm install` again
- **"Invalid credentials"** → Register first, then login
- **Images not showing** → Use the sample URLs provided above

### Common Fixes:
1. **Restart both servers** if something stops working
2. **Check browser console** (F12) for error messages
3. **Verify database tables exist** in pgAdmin
4. **Ensure both terminals are running** (backend on 3000, frontend on 4200)

## Features Available:
✅ JWT Authentication (Login/Logout)  
✅ User Registration (Artist/Curator roles)  
✅ CRUD Operations for Artworks  
✅ Image Display with Error Handling  
✅ Tag-based Filtering  
✅ Interactive Feedback System  
✅ Role-based Permissions  
✅ Responsive Design  
✅ Form Validation  
✅ Error Handling  

## API Endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/artworks` - Get all artworks
- `POST /api/artworks` - Create artwork (authenticated)
- `PUT /api/artworks/:id` - Update artwork (authenticated)
- `DELETE /api/artworks/:id` - Delete artwork (authenticated)
- `GET /api/feedback/artwork/:id` - Get feedback for artwork
- `POST /api/feedback` - Create feedback (curator only)

The application is now fully functional with all features working!