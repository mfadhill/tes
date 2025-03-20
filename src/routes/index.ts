import { authMiddleware } from './../middlewares/index';
import { Elysia, t } from 'elysia';
import { register, login } from '../controllers/users';
import { createDivision, deleteDivision, getDivisions, updateDivision } from '../controllers/divisions';
import { createDepartment, deleteDepartment, getDepartments, updateDepartment } from '../controllers/departments';
import { createEmployee, updateEmployee, getAllEmployees, getEmployeeById, deleteEmployee } from '../controllers/employee';
import { createProject, deleteProject, getProject, updateProject } from '../controllers/projects';
import { addAttendance, deleteAttendance, getAllAttendance, getAttendanceById, updateAttendance } from '../controllers/attendance';

export const routes = (app: Elysia) => {

  app.post('/register', async ({ body }) => register(body));
  app.post('/login', async ({ body }) => login(body));

  // Apply middleware to all protected routes
  app.use(authMiddleware);

  // Divisions Routes
  app.group('/divisions', division => division
    .get('/', () => getDivisions())
    .post('/', ({ body }) => createDivision(body))
    .put('/:id', ({ params, body }) => updateDivision(params.id, body))
    .delete('/:id', ({ params }) => deleteDivision(params.id))
  );

  app.group('/projects', project => project
    .get('/', () => getProject())
    .post('/', ({ body }) => createProject(body))
    .put('/:id', ({ params, body }) => updateProject(params.id, body))
    .delete('/:id', ({ params }) => deleteProject((params.id)))
  )

  // Departments Routes
  app.group('/departments', department => department
    .get('/', () => getDepartments())
    .post('/', ({ body }) => createDepartment(body))
    .put('/:id', ({ params, body }) => updateDepartment(parseInt(params.id), body))
    .delete('/:id', ({ params }) => deleteDepartment(parseInt(params.id)))
  );


  app.group('/attendance', attendance => attendance
    .post(
      '/',
      addAttendance,
      {
        body: t.Object({
          check_in: t.String(),
          check_out: t.String(),
          employee_id: t.Numeric()
        })
      }
    )

    .get('/', getAllAttendance)
    .get('/:id', getAttendanceById)
    .put('/:id', updateAttendance, {
      body: t.Object({
        check_in: t.String(),
        check_out: t.String()
      })
    })
    .delete('/:id', deleteAttendance)
  )


  // Employees Routes
  app.group('/employees', employee => employee
    .post('/', createEmployee, {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        department_id: t.Optional(t.Integer()),
        manager_id: t.Optional(t.Integer())
      })
    })
    .get('/', getAllEmployees)
    .get('/:id', getEmployeeById)
    .put('/:id', updateEmployee, {
      body: t.Object({
        name: t.String(),
        email: t.String(),
        department_id: t.Optional(t.Integer()),
        manager_id: t.Optional(t.Integer())
      })
    })
    .delete('/:id', deleteEmployee)
  );

  return app;
};
