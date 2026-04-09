import { Request,Response } from "express";
import { listClientService } from "../../services/Cliente/listClientsService";

export class ListClientController{
    async handle(_req:Request,res:Response){

        const service = new listClientService()

        const data = await service.execute()

        if(!data){
            throw new Error("Erro ao buscar lista de clientes")
        }

        res.status(200).json(data)
    }
}