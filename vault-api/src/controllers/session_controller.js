import { prisma } from '../db/prisma_client.js';
import { generateToken } from '../utils/jwt_gen.js';


export async function refreshToken(req, res) {
  const { refreshToken } = req.body;

  try {
    const savedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });

    if (!savedToken || new Date(savedToken.expiresAt) < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await prisma.user.findUnique({ where: { id: savedToken.userId } });
    if (!user) return res.status(401).json({ error: 'User not found' });

    // new token generation
    const newAccessToken = generateToken(user);
    const newRefreshToken = nanoid(64);
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    // delete old refresh token, create new 
    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { token: refreshToken } }),
      prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: user.id,
          expiresAt: expires,
        },
      }),
    ]);

    res.json({ token: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function logout(req, res) {
  const { refreshToken } = req.body;

  try {
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
