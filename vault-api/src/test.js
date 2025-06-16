import express from 'express';
import authRoutes from './routes/auth.js';

const app = express();
app.use(express.json());

const routes = []; // Track routes manually

// Wrap route definitions to auto-log them
function defineRoute(method, path, handler) {
  routes.push({ method, path });
  app[method](path, handler);
}

// Define routes using the wrapper
defineRoute('get', '/api/health', (req, res) => res.json({ status: 'OK' }));

app.use('/api/auth', authRoutes);

app.use((req, res, next) => {
  console.log('Incoming Request:', req.method, req.url);
  console.log('Request Body:', req.body); // <<< Check if body exists
  next();
});

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(5000, () => {
  console.log('Server running');
  console.log('Routes:', routes.length ? routes : 'None');
});