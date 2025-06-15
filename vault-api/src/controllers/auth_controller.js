import prisma from '../db/prismaClient.js'; 
import bcrypt from 'bcrypt';

async function registerUser(req, res) {
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

async function getProfile(req, res){
    const user = req.body;
    return user;
}

export default { registerUser, getProfile }


// IMPORT prisma from db
// IMPORT jwt generator util
// IMPORT bcrypt (if hashing)

// async function registerUser(req, res):
//     EXTRACT username, password FROM req.body
//     HASH password
//     STORE user in DB via prisma
//     GENERATE jwt
//     RETURN { token, user info }

// async function getProfile(req, res):
//     ACCESS req.user FROM jwtTradeAuth middleware
//     RETURN user profile

// EXPORT { registerUser, getProfile }