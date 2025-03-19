import { client } from '../db';
import { Handler } from 'elysia';
import { EmployeeBody } from '../types/index';

export const createEmployee: Handler = async ({ body, set }) => {
    const { name, email, department_id, manager_id } = body as EmployeeBody;

    const emailCheck = await client.query(
        `SELECT * FROM employees WHERE email = $1`,
        [email]
    );

    if (emailCheck.rows.length > 0) {
        set.status = 400;
        return { message: 'Email already exists' };
    }

    if (department_id) {
        const deptCheck = await client.query(
            `SELECT * FROM departments WHERE id = $1`,
            [department_id]
        );

        if (deptCheck.rows.length === 0) {
            set.status = 400;
            return { message: 'Department not found' };
        }
    }

    const result = await client.query(
        `INSERT INTO employees (name, email, department_id, manager_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, email, department_id, manager_id]
    );

    set.status = 201;
    return result.rows[0];
};

export const updateEmployee: Handler = async ({ params, body, set }) => {
    const { name, email, department_id, manager_id } = body as EmployeeBody;

    const result = await client.query(
        `UPDATE employees SET name=$1, email=$2, department_id=$3, manager_id=$4 WHERE id=$5 RETURNING *`,
        [name, email, department_id, manager_id, params.id]
    );

    if (result.rows.length === 0) {
        set.status = 404;
        return { message: 'Employee not found' };
    }
    return result.rows[0];
};

// GET ALL EMPLOYEES
export const getAllEmployees: Handler = async () => {
    const result = await client.query(
        `SELECT e.id, e.name, e.email, e.department_id, d.name AS department_name, e.manager_id, m.name AS manager_name
         FROM employees e
         LEFT JOIN departments d ON e.department_id = d.id
         LEFT JOIN employees m ON e.manager_id = m.id`
    );
    return result.rows;
};

// GET EMPLOYEE BY ID
export const getEmployeeById: Handler = async ({ params, set }) => {
    const result = await client.query(
        `SELECT e.id, e.name, e.email, e.department_id, d.name AS department_name, e.manager_id, m.name AS manager_name
         FROM employees e
         LEFT JOIN departments d ON e.department_id = d.id
         LEFT JOIN employees m ON e.manager_id = m.id
         WHERE e.id = $1`,
        [params.id]
    );

    if (result.rows.length === 0) {
        set.status = 404;
        return { message: 'Employee not found' };
    }
    return result.rows[0];
};

// DELETE EMPLOYEE
export const deleteEmployee: Handler = async ({ params, set }) => {
    const result = await client.query(
        `DELETE FROM employees WHERE id = $1 RETURNING *`,
        [params.id]
    );

    if (result.rows.length === 0) {
        set.status = 404;
        return { message: 'Employee not found' };
    }

    return { message: 'Employee deleted successfully' };
};
