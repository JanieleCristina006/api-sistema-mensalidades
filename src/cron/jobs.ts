import { CheckExpiredSubscription } from "../services/Assinatura/CheckExpiredSubscriptionService";
import cron from "node-cron"

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