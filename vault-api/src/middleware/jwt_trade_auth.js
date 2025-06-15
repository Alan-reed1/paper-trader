import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split?.(' ')[1]; 

  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; 
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
    console.log(`Exception while verifying: ${err}`)
  }
}

// IMPORT jwt

// async function jwtTradeAuth(req, res, next):
//     EXTRACT token FROM Authorization header (Bearer TOKEN)
//     VERIFY token
//     IF invalid → RETURN 403
//     ATTACH decoded user info to req.user
//     CALL next()
// EXPORT jwtTradeAuth