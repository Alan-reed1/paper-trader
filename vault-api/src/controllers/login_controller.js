import prisma from '../db/prismaClient.js';
import { generateToken } from '../utils/jwt_gen.js';
import bcrypt from 'bcrypt'

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


// IMPORT prisma
// IMPORT jwt generator
// IMPORT bcrypt

// async function loginUser(req, res):
//     EXTRACT username, password FROM req.body
//     FIND user by username via prisma
//     IF not found → RETURN 401
//     VERIFY password with bcrypt.compare
//     IF invalid → RETURN 401
//     GENERATE jwt
//     RETURN { token, user info }

// EXPORT { loginUser }