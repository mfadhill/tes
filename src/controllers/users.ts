import { client } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { successResponse, errorResponse } from '../utils/util';

const JWT_SECRET = 'rahasia123';

export const register = async (body: any) => {
    const { username, password } = body;

    const existing = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existing.rows.length > 0) return errorResponse('Username already exists');

    const hashed = await bcrypt.hash(password, 10);
    await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashed]);

    return successResponse('User registered!');
};

export const login = async (body: any) => {
    const { username, password } = body;

    const res = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    if (res.rows.length === 0) return errorResponse('User not found');

    const valid = await bcrypt.compare(password, res.rows[0].password);
    if (!valid) return errorResponse('Invalid password');

    const token = jwt.sign(
        { id: res.rows[0].id, username },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    return successResponse('Login success', { token });
};
