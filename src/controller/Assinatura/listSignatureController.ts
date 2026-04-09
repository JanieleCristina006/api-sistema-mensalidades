import { Request,Response } from "express";
import { SignatureService } from "../../services/Assisnatura/listSignatureService";

export class ListSignatureController{
    async handle(_req:Request,res:Response){

        const service = new SignatureService()

        const data = await service.execute()

        if(!data){
            throw new Error("Erro ao buscar assinaturas")
        }

        res.status(200).json(data)
    }
}