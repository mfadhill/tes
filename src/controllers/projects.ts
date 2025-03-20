import { client } from "../db";
import { errorResponse, successResponse } from "../utils/util";


export const getProject = async () => {
    const res = await client.query('SELECT * FROM projects');
    return successResponse('All projects', res.rows);
};

export const createProject = async (body: any) => {
    const { name } = body;
    if (!name) return errorResponse('Name is required');

    await client.query('INSERT INTO projects (name) VALUES ($1)', [name]);
    return successResponse('Projects created!');
};

export const updateProject = async (id: string, body: any) => {
    const numericId = parseInt(id, 10);
    const { name } = body;
    if (!name) return errorResponse('Name is required');

    const res = await client.query('UPDATE projects SET name = $1 WHERE id = $2', [name, numericId]);
    if (res.rowCount === 0) return errorResponse('Project not found');

    return successResponse('Project updated!');
};

export const deleteProject = async (id: string) => {
    const numericId = parseInt(id, 10);
    const res = await client.query('DELETE FROM projects WHERE id = $1', [numericId]);

    if (res.rowCount === 0) return errorResponse('project not found');

    return successResponse('project deleted!');
};