import { Request,Response } from "express";
import { CreatePlanService } from "../../services/Plano/createPlanService";

export class CreatePlanController{
    async handle(req:Request,res:Response){
        const { nome,preco,status} = req.body

        const service = new CreatePlanService()

        const data = await service.execute({nome,preco,status})

        if(!data){
            throw new Error("Plano não cadastrado!")
        }

        res.status(201).json(data)
    }
}
