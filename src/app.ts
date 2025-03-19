import { Elysia } from 'elysia';
import { routes } from './routes/index';

const app = new Elysia();

routes(app);

app.listen(3000);
console.log(' http://localhost:3000');
