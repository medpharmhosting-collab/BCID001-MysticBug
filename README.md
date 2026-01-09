# MysticBug-Medih

A comprehensive healthcare management platform with patient dashboards, doctor management, and medical record handling.

## Project Structure

- **Backend/** - Node.js/Express server with MongoDB database
- **Frontend/** - React application built with Vite and Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB database
- Firebase account (for authentication and storage)

## Installation

### Backend Setup

1. Navigate to the Backend directory:

   ```bash
   cd Backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the Backend directory with the following variables:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY_ID=your_private_key_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_CLIENT_ID=your_client_id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_CERT_URL=your_client_cert_url
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the backend server:

   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

The backend server will run on `http://localhost:5000` (or configured port).

### Frontend Setup

1. Navigate to the Frontend directory:

   ```bash
   cd Frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the Frontend directory with the following variables:

   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_BASE_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` (default Vite port).

## Available Scripts

### Backend Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Development Workflow

1. Start the backend server first:

   ```bash
   cd Backend ; npm run dev
   ```

2. In a new terminal, start the frontend:

   ```bash
   cd Frontend ; npm run dev
   ```

3. Open your browser to `http://localhost:5173`

## Features

- Patient Dashboard with medical records, appointments, and prescriptions, reminders.
- Doctor management system
- admin to track status of everything
- Real-time notifications
- Secure authentication with Firebase
- Secure file uploads with Supabase
- Responsive design for mobile and desktop

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- Firebase Admin SDK
- JWT authentication
- Supabase for file uploads

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Firebase SDK
- React Icons
- Recharts for data visualization
