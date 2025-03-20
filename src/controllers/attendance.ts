import { Handler } from 'elysia';
import { client } from '../db';
import { attendanceBody } from '../types/index';

// CREATE
export const addAttendance: Handler = async ({ body }) => {
    const { employee_id, check_in, check_out } = body as attendanceBody;

    const result = await client.query(
        `INSERT INTO attendance (employee_id, check_in, check_out) 
     VALUES ($1, $2, $3) RETURNING *`,
        [employee_id, check_in, check_out]
    );

    return result.rows[0];
};
export const getAllAttendance: Handler = async () => {
    const result = await client.query(`
    SELECT 
      a.id, 
      a.employee_id, 
      e.name AS employee_name,
      a.check_in, 
      a.check_out
    FROM attendance a
    JOIN employees e ON a.employee_id = e.id
    ORDER BY a.id
  `);
    return result.rows;
};

// READ BY ID
export const getAttendanceById: Handler = async ({ params }) => {
    const result = await client.query(`SELECT * FROM attendance WHERE id = $1`, [params.id]);

    if (result.rows.length === 0) return { message: 'Attendance not found' };

    return result.rows[0];
};

export const updateAttendance: Handler = async ({ params, body }) => {
    const { check_in, check_out } = body as attendanceBody;

    const result = await client.query(
        `UPDATE attendance SET check_in = $1, check_out = $2 WHERE id = $3 RETURNING *`,
        [check_in, check_out, params.id]
    );

    if (result.rows.length === 0) return { message: 'Attendance not found' };

    return result.rows[0];
};

export const deleteAttendance: Handler = async ({ params }) => {
    await client.query(`DELETE FROM attendance WHERE id = $1`, [params.id]);

    return { message: 'Attendance deleted successfully' };
};
