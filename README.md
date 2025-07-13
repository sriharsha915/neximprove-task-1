
# CustomsBridge - Customs Brokerage Platform

A professional customs brokerage platform for managing client onboarding, declarations, and compliance workflows.

## Project Structure

```
customsbridge/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API service layer
│   │   └── hooks/          # Custom React hooks
│   └── package.json
├── backend/                 # Express.js API server
│   ├── server.ts           # Main server file
│   ├── db.json            # JSON database (development)
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Features

- **Client Registration**: Comprehensive form for exporter/importer onboarding
- **Dashboard**: Real-time statistics and client management
- **Admin Panel**: Administrative oversight of all registered clients
- **API Integration**: RESTful backend with proper validation
- **Responsive Design**: Mobile-friendly interface
- **Data Export**: CSV export functionality for client data

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn/UI component library
- React Router for navigation
- React Query for state management

### Backend
- Node.js with Express.js
- TypeScript for type safety
- bcryptjs for password hashing
- JSON Web Tokens for authentication
- CORS for cross-origin requests
- File-based JSON database (development)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory (root):
```bash
cd ../
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

## API Endpoints

### Client Management
- `POST /api/clients` - Register a new client
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get specific client
- `GET /api/stats` - Get dashboard statistics
- `GET /api/health` - Health check

### Request/Response Examples

#### Register Client
```bash
POST /api/clients
Content-Type: application/json

{
  "companyName": "Acme Exports Ltd",
  "contactName": "John Doe",
  "email": "john@acmeexports.com",
  "gstin": "27AAAAA0000A1Z5",
  "clientType": "exporter",
  "phone": "+91-9876543210",
  "address": "123 Business Park",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001"
}
```

## Database Schema

### Client Entity
```typescript
interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  gstin: string;
  clientType: 'exporter' | 'importer' | 'both';
  address: string;
  city: string;
  state: string;
  pincode: string;
  registrationDate: string;
  status: string;
}
```

## Security Features

- Input validation and sanitization
- GSTIN format validation
- Email format validation
- Password hashing with bcrypt
- JWT token authentication (ready for implementation)
- CORS configuration
- SQL injection prevention (when using SQL database)

## Migration to PostgreSQL

To migrate from JSON file storage to PostgreSQL:

1. Install PostgreSQL dependencies:
```bash
npm install pg @types/pg
```

2. Replace file operations with PostgreSQL queries
3. Add database connection configuration
4. Implement proper migration scripts
5. Add connection pooling for production

## Deployment

### Backend Deployment
- Configure environment variables
- Set up PostgreSQL database
- Deploy to cloud platform (AWS, Heroku, DigitalOcean)
- Configure CORS for production domain

### Frontend Deployment
- Update API base URL for production
- Build optimized bundle: `npm run build`
- Deploy static files to CDN or hosting service
- Configure domain and SSL certificate

## Environment Variables

Create `.env` files for production:

### Backend (.env)
```
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=postgresql://user:password@localhost:5432/customsbridge
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=https://api.yourdomain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
