import "dotenv/config";
import express from 'express';
import router from './routes/routes';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/error';
import { CancelPendingInitialPaymentJob, CheckExpiredSubscriptionJob } from './cron/jobs';
import cors from "cors";

const app = express();


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(authMiddleware)
app.use(router)
CheckExpiredSubscriptionJob()
CancelPendingInitialPaymentJob()

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
