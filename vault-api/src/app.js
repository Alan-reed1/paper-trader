import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import { prisma } from './db/prisma_client.js';

console.log('Express app starting...'); // Should appear immediately

try {
  const app = express();
  dotenv.config();
  

  // Middleware
  app.use(cors());
  app.use(express.json());



  // Routes

  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
  });

  app.use('/api/auth', authRoutes); 

  // 404 Handler
  // app.use('*', (req, res) => {
  //   res.status(404).json({ error: 'Not Found' });
  // });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  // Start server after DB connection check
  const PORT = process.env.PORT || 5000;
  async function startServer() {
    try {
      await Promise.race([
        prisma.$connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('DB timeout')), 5000)
        )
      ]);
      console.log('Connected to DB');
      
      const server = app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
      });
      
    } catch (error) {
      console.error('Failed to connect to DB:', error);
      process.exit(1);
    }
  }
  startServer();
} catch (initError) {
  console.error('CRITICAL INIT ERROR:', initError);
  process.exit(1);
}