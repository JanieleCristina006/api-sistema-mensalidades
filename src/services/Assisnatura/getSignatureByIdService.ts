import {prisma} from "../../config/prisma";

export class getSignatureByIdService{

    async execute(id_assinatura:number){
        
        const existSignature = prisma.assinatura.findUnique({
            where:{
                id: id_assinatura
            }
        })

        if(!existSignature){
            throw new Error("Assinatura não encontrada!")
        }

        return existSignature;

    }
}