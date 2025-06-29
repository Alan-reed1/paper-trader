import { prisma } from '../db/prisma_client.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt_gen.js';
import { nanoid } from 'nanoid';

function generateRefreshToken() {
    return nanoid(64);
}

// user registration function
export async function registerUser(req, res) {
    // grab username and password from the request
    console.log("register route hit ");
    const { username, password } = req.body;

    // check if the user has inputted a username and a password
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    // set the salting rounds for password hashing
    const SALT_ROUNDS = 12;

    // start the registration process
    try {
        // make sure that the user has chosen a unique username
        const existing = await prisma.user.findUnique({ where: { username } });
        if (existing) return res.status(400).json({ error: 'Username already taken' });

        // hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // create the new user in the db via prisma
        const user = await prisma.user.create({
            data: { username, password: hashedPassword },
        });

        // POST info about new user if creation succesful
        res.status(201).json({
            id: user.id,
            username: user.username,
            createdAt: user.createdAt,
        });

    // handle unknown errors (add central error handling later)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


// user login function
export async function loginUser(req, res) {
    // grab username and password from the req
    const { username, password } = req.body;

    // make sure uname and pw are both present
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    // login process
    try {
        // find the user, if no user exists throw error
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return res.status(401).json({ error: 'Invalid username or password' });

        // check if pw is valis using bcrypt
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: 'Invalid username or password' });

        // generate a JWT token on login 
        const token = generateToken(user);
        const refreshToken = generateRefreshToken()
        const expires = new Date()
        expires.setDate(expires.getDate() + 7);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: expires,
            },
        });

        // on successful login, record response
        return res.status(200).json({
        token,
        refreshToken,
        user: { id: user.id, username: user.username },
        });
    
    // error handling
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
}