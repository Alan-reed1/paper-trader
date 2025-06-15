import prisma from '../db/prismaClient.js'; 
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt_gen.js';

export async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user);

    return res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}


export async function registerUser(req, res) {
    const SALT_ROUNDS = 12;

    router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const user = await prisma.user.create({
        data: { username, password: hashedPassword },
        });

        res.json({ id: user.id, username: user.username, createdAt: user.createdAt });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
    });
}