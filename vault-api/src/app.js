import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Example route:
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Create user
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.create({
      data: { username, password }, // TODO: hash password
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));