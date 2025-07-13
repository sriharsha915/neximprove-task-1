
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Database simulation (in production, use PostgreSQL)
const DB_PATH = path.join(__dirname, 'db.json');

interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  gstin: string;
  clientType: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  registrationDate: string;
  status: string;
}

interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'broker';
  createdAt: string;
}

interface Database {
  clients: Client[];
  users: User[];
}

// Initialize database
const initializeDB = (): Database => {
  if (!fs.existsSync(DB_PATH)) {
    const initialDB: Database = {
      clients: [],
      users: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
};

const saveDB = (data: Database) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CustomsBridge API is running' });
});

// Client registration
app.post('/api/clients', async (req, res) => {
  try {
    const clientData = req.body;
    
    // Validation
    const required = ['companyName', 'contactName', 'email', 'gstin', 'clientType'];
    const missing = required.filter(field => !clientData[field]);
    
    if (missing.length > 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Missing required fields',
        missing
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientData.email)) {
      return res.status(400).json({
        error: 'Invalid Email',
        message: 'Please enter a valid email address'
      });
    }

    // GSTIN validation
    if (clientData.gstin.length !== 15) {
      return res.status(400).json({
        error: 'Invalid GSTIN',
        message: 'GSTIN must be 15 characters long'
      });
    }

    const db = initializeDB();
    
    // Check if client already exists
    const existingClient = db.clients.find(c => 
      c.email === clientData.email || c.gstin === clientData.gstin
    );
    
    if (existingClient) {
      return res.status(409).json({
        error: 'Client Exists',
        message: 'Client with this email or GSTIN already exists'
      });
    }

    // Create new client
    const newClient: Client = {
      id: Date.now().toString(),
      ...clientData,
      registrationDate: new Date().toISOString(),
      status: 'Active'
    };

    db.clients.push(newClient);
    saveDB(db);

    res.status(201).json({
      message: 'Client registered successfully',
      client: newClient
    });

  } catch (error) {
    console.error('Error registering client:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register client'
    });
  }
});

// Get all clients
app.get('/api/clients', (req, res) => {
  try {
    const db = initializeDB();
    res.json({
      clients: db.clients,
      total: db.clients.length
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch clients'
    });
  }
});

// Get client by ID
app.get('/api/clients/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = initializeDB();
    const client = db.clients.find(c => c.id === id);
    
    if (!client) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Client not found'
      });
    }
    
    res.json({ client });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch client'
    });
  }
});

// Get client statistics
app.get('/api/stats', (req, res) => {
  try {
    const db = initializeDB();
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const stats = db.clients.reduce((acc, client) => {
      acc.totalClients++;
      
      const regDate = new Date(client.registrationDate);
      if (regDate.getMonth() === thisMonth && regDate.getFullYear() === thisYear) {
        acc.thisMonth++;
      }
      
      switch (client.clientType) {
        case 'exporter': acc.exporters++; break;
        case 'importer': acc.importers++; break;
        case 'both': acc.both++; break;
      }
      
      return acc;
    }, { 
      totalClients: 0, 
      exporters: 0, 
      importers: 0, 
      both: 0, 
      thisMonth: 0,
      activeDeclarations: 12,
      pendingReviews: 3,
      completedThisMonth: 45
    });
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch statistics'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 CustomsBridge API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
