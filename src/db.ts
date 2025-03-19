import { Client } from 'pg';

export const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'awkok',
    password: 'admin',
    port: 5432,
});

await client.connect();
console.log('Database Connect');

await client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )
`);

await client.query(`
  CREATE TABLE IF NOT EXISTS divisions (   
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
  )
`);

await client.query(`
  CREATE TABLE IF NOT EXISTS departments(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    division_id INTEGER,
    FOREIGN KEY (division_id) REFERENCES divisions(id)
  )
`);

await client.query(`
  CREATE TABLE IF NOT EXISTS employees(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    department_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
  )
`);

await client.query(`
  CREATE TABLE IF NOT EXISTS projects (   
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
  )
`);

await client.query(`
  CREATE TABLE IF NOT EXISTS employee_project (   
    employee_id INTEGER,
    project_id INTEGER,
    PRIMARY KEY (employee_id, project_id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
  )
`);

await client.query(`
  CREATE TABLE IF NOT EXISTS attendance (   
    id SERIAL PRIMARY KEY,
    employee_id INTEGER,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
  )
`);
