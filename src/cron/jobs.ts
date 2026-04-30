import cron from "node-cron";
import { CancelPendingInitialPaymentService } from "../services/Assinatura/cancelPendingInitialPaymentService";
import { CheckExpiredSubscription } from "../services/Assinatura/checkExpiredSubscriptionService";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export function CheckExpiredSubscriptionJob() {
  const service = new CheckExpiredSubscription();

  cron.schedule(
    "0 15 * * *",
    async () => {
      console.log(`[CRON] Verificando assinaturas vencidas em ${new Date().toISOString()}`);

      try {
        await service.execute();
      } catch (error) {
        console.error(
          `[CRON] Falha ao verificar assinaturas vencidas: ${getErrorMessage(error)}`
        );
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
    "0 0 * * *",
    async () => {
      console.log("[CRON] Verificando pagamentos iniciais pendentes...");

      try {
        const result = await service.execute();
        console.log(`[CRON] Assinaturas canceladas: ${result.total_canceladas}`);
      } catch (error) {
        console.error(
          `[CRON] Falha ao cancelar pagamentos iniciais pendentes: ${getErrorMessage(
            error
          )}`
        );
      }
    },
    {
      timezone: "America/Sao_Paulo",
    }
  );
}
