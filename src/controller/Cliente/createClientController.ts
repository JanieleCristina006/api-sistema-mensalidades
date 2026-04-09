import { Request,Response } from "express";
import { createClientService } from "../../services/Cliente/createClientService";


export class CreateClientController{
    async handle(req:Request,res:Response){
        const { nome,email,cpf,telefone,plano_id } = req.body

        const service = new createClientService()

        const data = await service.execute({nome,email,cpf,telefone,plano_id})

        if(!data){
            throw new Error("Cliente não cadastrado!")
        }

        res.status(201).json({
            message:"Cliente cadastrado!",
            data
        })
    }
}