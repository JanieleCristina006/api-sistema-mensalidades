import { Router } from "express";

import { CreateClientController } from "../controller/Cliente/createClientController";
import { ListClientsController } from "../controller/Cliente/listClientsController";
import { GetClientByIdController } from "../controller/Cliente/getClientByIdController";
import { UpdateClientController } from "../controller/Cliente/updateClientController";
import { DeleteClientController } from "../controller/Cliente/deleteClientController";

import { CreatePlanController } from "../controller/Plano/createPlanController";
import { ListPlanController } from "../controller/Plano/listPlanController";
import { UpdatePlanController } from "../controller/Plano/updatePlanController";
import { UpdatePlanStatusController } from "../controller/Plano/updatePlanStatusController";

import { validateBody } from "../middleware/validateBody";
import { validateParams } from "../middleware/validateParams";

import { clientSchema } from "../schemas/Cliente/createClientSchema";
import { updatedClientSchema } from "../schemas/Cliente/updateClientSchema";
import { createPlanSchema } from "../schemas/Plano/createPlanSchema";
import { updatePlanSchema } from "../schemas/Plano/updatePlanSchema";
import { updatePlanStatusSchema } from "../schemas/Plano/updatePlanStatusSchema";
import { idSchema } from "../schemas/Global/idSchema";
import { ListSignatureController } from "../controller/Assinatura/listSignatureController";
import { GetSignatureByIdController } from "../controller/Assinatura/getSignatureByIdController";
import { CancelSubscriptionController } from "../controller/Assinatura/cancelSubscriptionController";
import { CreateSubscriptionPaymentController } from "../controller/Pagamento/createSubscriptionPaymentController";
import { createSubscriptionPaymentSchema } from "../schemas/Pagamento/createSubscriptionPaymentSchema";
import { CreateAdminController } from "../controller/Admin/createAdminController";
import { LoginController } from "../controller/Admin/loginController";
import { createAdminSchema } from "../schemas/Admin/createAdminSchema";
import { loginAdminSchema } from "../schemas/Admin/loginAdminSchema";
import { upload } from "../config/multer";
import { CreateSubscriptionController } from "../controller/Assinatura/createSubscriptionController";
import { createSubscriptionSchema } from "../schemas/Assinaturas/createSubscriptionSchema";
import { ForgotPasswordController } from "../controller/Admin/ResetPassword/forgotPasswordController";
import { forgotPasswordSchema } from "../schemas/Admin/forgotPasswordSchema";
import { ResetPasswordController } from "../controller/Admin/ResetPassword/resetPasswordController";
import { resetPasswordSchema } from "../schemas/Admin/resetPasswordSchema";

const router = Router();

// Admins
router.post(
  "/admins",
  upload.single("avatar"),
  validateBody(createAdminSchema),
  new CreateAdminController().handle
);

router.post(
  "/admins/login",
  validateBody(loginAdminSchema),
  new LoginController().handle
);

router.post(
  "/admins/recuperar-senha",
  validateBody(forgotPasswordSchema),
  new ForgotPasswordController().handle
);

router.post(
  "/admins/redefinir-senha",
  validateBody(resetPasswordSchema),
  new ResetPasswordController().handle
);

// Clientes
router.post(
  "/clientes",
  validateBody(clientSchema),
  new CreateClientController().handle
);

router.get(
  "/clientes",
  new ListClientsController().handle
);

router.get(
  "/clientes/:id",
  validateParams(idSchema),
  new GetClientByIdController().handle
);

router.post(
  "/clientes/:id/assinaturas",
  validateParams(idSchema),
  validateBody(createSubscriptionSchema),
  new CreateSubscriptionController().handle
)

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
  upload.single("banner"),
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
  validateBody(updatePlanSchema),
  new UpdatePlanController().handle
);

router.patch(
  "/planos/:id/status",
  validateParams(idSchema),
  validateBody(updatePlanStatusSchema),
  new UpdatePlanStatusController().handle
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

router.patch(
  "/assinaturas/:id/confirmar-pagamento",
  validateParams(idSchema),
  validateBody(createSubscriptionPaymentSchema),
  new CreateSubscriptionPaymentController().handle
)

export default router;
