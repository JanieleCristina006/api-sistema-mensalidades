import { Router } from "express";
import { CreateClientController } from "../controller/Cliente/createClientController";
import { validateSchema } from "../middleware/validateSchema";
import { clientSchema } from "../schemas/Cliente/createClientSchema";
import { ListClientController } from "../controller/Cliente/listClientsService";
import { GetClientByIdController } from "../controller/Cliente/getClientByIdController";
import { validaId } from "../middleware/validateId";
import { updatedClientSchema } from "../schemas/Cliente/updateClientSchema";
import { UpdateClientController } from "../controller/Cliente/updateClientController";
import { DeleteClientController } from "../controller/Cliente/deleteClienteController";
import { CreatePlanController } from "../controller/Plano/createPlanController";
import { createPlanoSchema } from "../schemas/Plano/createPlanoSchema";
import { ListPlanController } from "../controller/Plano/listPlanController";
import { UpdatePlanController } from "../controller/Plano/updatePlanController";

const router = Router()

// Cadastrar Cliente
router.post("/cadastrar",validateSchema(clientSchema),new CreateClientController().handle)

// Listar Clientes
router.get("/clientes",new ListClientController().handle )

// Listar cliente expecífico
router.get("/cliente/:id",validaId,new GetClientByIdController().handle)

// Atualizar Cliente
router.put("/cliente/:id",validateSchema(updatedClientSchema),new UpdateClientController().handle)

// Deletar Cliente
router.delete("/cliente/:id",validaId,new DeleteClientController().handle)


// Rotas do plano

// Cadastrar Plano
router.post("/cadastrar-plano",validateSchema(createPlanoSchema),new CreatePlanController().handle)

// Listar Plano
router.get("/planos",new ListPlanController().handle)

// Atualizar Plano 
router.put("/plano/:id",validaId,new UpdatePlanController().handle)

export default router;
