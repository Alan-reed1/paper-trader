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
  // app.use(cors());
  app.use(express.json());



  // Routes
  console.log("route init-ing")
  app.get('/ping', (req, res) => {
  console.log('Ping route hit');
  res.send('pong');
});
  // app.get('/api/health', (req, res) => {
  //   res.json({ status: 'OK' });
  // });

  // app.use('/api/auth', authRoutes); 

  // // 404 Handler
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
        
        // Windows-friendly initialization check
        const checkReady = () => {
          if (app._router) {
            console.log("app router was ready")
            printRoutes();
          } else {
            console.log('timing out')
            setTimeout(checkReady, 50);
          }
        };
        checkReady();
      });

    } catch (error) {
      console.error('Failed to connect to DB:', error);
      process.exit(1);
    }
  }

  function printRoutes() {
  // Modern Express 5+ compatible check
  const router = app._router || (app.listen && app._router);
  
  if (!router) {
    console.log('Router not initialized - waiting...');
    setTimeout(printRoutes, 100); // Retry after delay
    return;
  }

  const routes = [];
  router.stack.forEach(layer => {
    if (layer.route) {
      // Direct routes
      routes.push({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods).map(m => m.toUpperCase())
      });
    } else if (layer.name === 'router' && layer.handle.stack) {
      // Router instances
      const prefix = layer.regexp.source
        .replace('^\\', '')
        .replace('(?:\\/(?=$))?$', '')
        .replace('\\/?$', '')
        .replace(/\\\//g, '/');
      
      layer.handle.stack.forEach(innerLayer => {
        if (innerLayer.route) {
          routes.push({
            path: prefix + innerLayer.route.path,
            methods: Object.keys(innerLayer.route.methods).map(m => m.toUpperCase())
          });
        }
      });
    }
  });

  console.log('\n🚀 Active Routes:');
  routes.forEach(route => {
    console.log(`→ ${route.methods.join(', ').padEnd(8)} ${route.path}`);
  });
}
  startServer();
} catch (initError) {
  console.error('CRITICAL INIT ERROR:', initError);
  process.exit(1);
}