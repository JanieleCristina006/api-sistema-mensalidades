import { Router } from "express";
import { CreateClientController } from "../controller/Cliente/createClientController";
import { validateSchema } from "../middleware/validateSchema";
import { clientSchema } from "../schemas/createClientSchema";
import { ListClientController } from "../controller/Cliente/listClientsService";
import { GetClientByIdController } from "../controller/Cliente/getClientByIdController";
import { validaId } from "../middleware/validateId";
import { updatedClientSchema } from "../schemas/updateClientSchema";
import { UpdateClientController } from "../controller/Cliente/updateClientController";
import { DeleteClientController } from "../controller/Cliente/deleteClienteController";

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

export default router;