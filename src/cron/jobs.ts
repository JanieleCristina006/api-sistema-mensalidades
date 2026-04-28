import cron from "node-cron"
import { CheckExpiredSubscription } from "../services/Assinatura/CheckExpiredSubscriptionService";
import { CancelPendingInitialPaymentService } from "../services/Assinatura/CancelPendingInitialPaymentService";


export function CheckExpiredSubscriptionJob() {
    
  const service = new CheckExpiredSubscription();

  cron.schedule(
    "07 15 * * *",
    async () => {
      console.log(`[CRON] Executado em: ${new Date().toISOString()}`);

      try {
        await service.execute();
      } catch (error) {
        console.log(error);
      }
    },
    {
      timezone: "America/Sao_Paulo",
    }
  );
}

export function CancelPendingInitialPaymentJob() {
  const service = new CancelPendingInitialPaymentService();

  cron.schedule(
    "0 0 * * *", // todo dia meia-noite
    async () => {
      console.log("Verificando pagamentos pendentes...");

      try {
        const result = await service.execute();
        console.log(`Canceladas: ${result.total_canceladas}`);
      } catch (error) {
        console.log(error);
      }
    },
    {
      timezone: "America/Sao_Paulo",
    }
  );
}