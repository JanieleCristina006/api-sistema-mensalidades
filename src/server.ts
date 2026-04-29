import "dotenv/config";
import express from 'express';
import router from './routes/routes';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/error';
import { CancelPendingInitialPaymentJob, CheckExpiredSubscriptionJob } from './cron/jobs';

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(authMiddleware)
app.use(router)
CheckExpiredSubscriptionJob()
CancelPendingInitialPaymentJob()

app.use(errorHandler)

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000...');
});
