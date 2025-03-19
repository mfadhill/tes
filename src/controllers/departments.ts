import { client } from '../db';
import { successResponse, errorResponse } from '../utils/util';

export const getDepartments = async () => {
    try {
        const res = await client.query('SELECT * FROM departments');
        return successResponse('All departments', res.rows);
    } catch (error) {
        return errorResponse('Error fetching departments');
    }
};

export const createDepartment = async (body: any) => {
    const { name, division_id } = body;
    if (!name || !division_id) return errorResponse('Name and division_id are required');

    try {
        await client.query('INSERT INTO departments (name, division_id) VALUES ($1, $2)', [name, division_id]);
        return successResponse('Department created!');
    } catch (error) {
        return errorResponse('Error creating department');
    }
};

export const updateDepartment = async (id: number, body: any) => {
    const { name, division_id } = body;
    if (!name || !division_id) return errorResponse('Name and division_id are required');

    try {
        const res = await client.query('UPDATE departments SET name = $1, division_id = $2 WHERE id = $3', [name, division_id, id]);
        if (res.rowCount === 0) return errorResponse('Department not found');
        return successResponse('Department updated!');
    } catch (error) {
        return errorResponse('Error updating department');
    }
};

export const deleteDepartment = async (id: number) => {
    try {
        const res = await client.query('DELETE FROM departments WHERE id = $1', [id]);
        if (res.rowCount === 0) return errorResponse('Department not found');
        return successResponse('Department deleted!');
    } catch (error) {
        return errorResponse('Error deleting department');
    }
};
