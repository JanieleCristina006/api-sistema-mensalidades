import { prisma } from "../../config/prisma";
import { SignatureStatus } from "@prisma/client";


export class CancelSubscriptionService{
    async execute(id_assinatura:number){

        const existSignature = await prisma.assinatura.findUnique({
            where: {
                id: id_assinatura,
            },
        })

        if(!existSignature){
            throw new Error("Assinatura não encontrada!")
        }

        const updateStatus = await prisma.assinatura.update({
            where:{
                id: id_assinatura
            },
            data:{
                status: SignatureStatus.CANCELLED
            }
        })


        return updateStatus;

    }
}