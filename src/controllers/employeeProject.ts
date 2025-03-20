import { Handler } from 'elysia';
import { client } from '../db.js';
import { employeedProject } from '../types/index'

export const getAllEmployeeProjects: Handler = async () => {
    const result = await client.query(`
    SELECT ep.employee_id, e.name AS employee_name, ep.project_id, p.name AS project_name
    FROM employee_project ep
    JOIN employees e ON ep.employee_id = e.id
    JOIN projects p ON ep.project_id = p.id
  `);
    return result.rows;
};

export const addEmployeeProject: Handler = async ({ body, set }) => {
    const { employee_id, project_id } = body as employeedProject;

    // Cek apakah employee_id ada
    const employee = await client.query('SELECT * FROM employees WHERE id = $1', [employee_id]);
    if (employee.rows.length === 0) {
        set.status = 404;
        return { message: 'Employee not found' };
    }

    // Cek apakah project_id ada
    const project = await client.query('SELECT * FROM projects WHERE id = $1', [project_id]);
    if (project.rows.length === 0) {
        set.status = 404;
        return { message: 'Project not found' };
    }

    const existing = await client.query(
        'SELECT * FROM employee_project WHERE employee_id = $1 AND project_id = $2',
        [employee_id, project_id]
    );
    if (existing.rows.length > 0) {
        set.status = 400;
        return { message: 'Employee already assigned to this project' };
    }

    await client.query(
        'INSERT INTO employee_project (employee_id, project_id) VALUES ($1, $2)',
        [employee_id, project_id]
    );

    return { message: 'Employee assigned to project successfully' };
};

export const deleteEmployeeProject: Handler = async ({ params }) => {
    const { employee_id, project_id } = params;
    await client.query(
        'DELETE FROM employee_project WHERE employee_id = $1 AND project_id = $2',
        [employee_id, project_id]
    );
    return { message: 'Employee removed from project' };
};
