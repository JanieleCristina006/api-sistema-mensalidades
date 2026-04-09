import { Router } from "express";

import { CreateClientController } from "../controller/Cliente/createClientController";
import { ListClientController } from "../controller/Cliente/listClientsController";
import { GetClientByIdController } from "../controller/Cliente/getClientByIdController";
import { UpdateClientController } from "../controller/Cliente/updateClientController";
import { DeleteClientController } from "../controller/Cliente/deleteClientController";

import { CreatePlanController } from "../controller/Plano/createPlanController";
import { ListPlanController } from "../controller/Plano/listPlanController";
import { UpdatePlanController } from "../controller/Plano/updatePlanController";
import { UpdateStatusPlanController } from "../controller/Plano/updatePlanStatusController";

import { validateBody } from "../middleware/validateBody";
import { validateParams } from "../middleware/validateParams";

import { clientSchema } from "../schemas/Cliente/createClientSchema";
import { updatedClientSchema } from "../schemas/Cliente/updateClientSchema";
import { createPlanSchema } from "../schemas/Plano/createPlanSchema";
import { updatePlanStatusSchema } from "../schemas/Plano/updatePlanStatusSchema";
import { idSchema } from "../schemas/Global/idSchema";
import { ListSignatureController } from "../controller/Assinatura/listSignatureController";
import { GetSignatureByIdController } from "../controller/Assinatura/getSignatureByIdController";
import { CancelSubscriptionController } from "../controller/Assinatura/cancelSubscriptionController";

const router = Router();

// Clientes
router.post(
  "/clientes",
  validateBody(clientSchema),
  new CreateClientController().handle
);

router.get(
  "/clientes",
  new ListClientController().handle
);

router.get(
  "/clientes/:id",
  validateParams(idSchema),
  new GetClientByIdController().handle
);

router.put(
  "/clientes/:id",
  validateParams(idSchema),
  validateBody(updatedClientSchema),
  new UpdateClientController().handle
);

router.delete(
  "/clientes/:id",
  validateParams(idSchema),
  new DeleteClientController().handle
);

// Planos
router.post(
  "/planos",
  validateBody(createPlanSchema),
  new CreatePlanController().handle
);

router.get(
  "/planos",
  new ListPlanController().handle
);

router.put(
  "/planos/:id",
  validateParams(idSchema),
  new UpdatePlanController().handle
);

router.patch(
  "/planos/:id/status",
  validateParams(idSchema),
  validateBody(updatePlanStatusSchema),
  new UpdateStatusPlanController().handle
);

// Assinaturas
router.get(
  "/assinaturas",
  new ListSignatureController().handle
)

router.get(
  "/assinaturas/:id",
  validateParams(idSchema),
  new GetSignatureByIdController().handle
)

router.post(
  "/assinaturas/:id",
  validateParams(idSchema),
  new CancelSubscriptionController().handle
)

export default router;
