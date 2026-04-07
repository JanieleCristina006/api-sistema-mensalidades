import express from 'express';
import router from './routes/routes';
import { errorHandler } from './middleware/error';
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(router)

app.use(errorHandler)

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000...');
});