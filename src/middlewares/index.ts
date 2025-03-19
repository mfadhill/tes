import { Elysia } from 'elysia';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'rahasia123';

export const authMiddleware = new Elysia().derive(({ headers, set }) => {
    const authHeader = headers['authorization'];

    if (!authHeader) {
        set.status = 401;
        throw new Error('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return { user: decoded };
    } catch (err) {
        set.status = 403;
        throw new Error('Invalid token');
    }
});
