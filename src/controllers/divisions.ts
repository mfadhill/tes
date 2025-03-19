import { client } from '../db';
import { successResponse, errorResponse } from '../utils/util';

export const getDivisions = async () => {
    const res = await client.query('SELECT * FROM divisions');
    return successResponse('All divisions', res.rows);
};

export const createDivision = async (body: any) => {
    const { name } = body;
    if (!name) return errorResponse('Name is required');

    await client.query('INSERT INTO divisions (name) VALUES ($1)', [name]);
    return successResponse('Division created!');
};

export const updateDivision = async (id: string, body: any) => {
    const numericId = parseInt(id, 10);
    const { name } = body;
    if (!name) return errorResponse('Name is required');

    const res = await client.query('UPDATE divisions SET name = $1 WHERE id = $2', [name, numericId]);
    if (res.rowCount === 0) return errorResponse('Division not found');

    return successResponse('Division updated!');
};

export const deleteDivision = async (id: string) => {
    const numericId = parseInt(id, 10);
    const res = await client.query('DELETE FROM divisions WHERE id = $1', [numericId]);

    if (res.rowCount === 0) return errorResponse('Division not found');

    return successResponse('Division deleted!');
};
