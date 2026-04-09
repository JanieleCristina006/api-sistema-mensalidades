
import {prisma} from "../../config/prisma"
import { addDays } from "date-fns"
import { PlanStatus } from "@prisma/client"

interface createClientAssinaturaProps{
    email:    string
    nome:     string
    cpf :     string
    telefone: string
    plano_id: number
    
}

export class createClientService{
    async execute({nome,email,cpf,telefone,plano_id }:createClientAssinaturaProps){

        const existEmail = await prisma.client.findUnique({
            where: {
                email: email
            }
        })

         const existPhone = await prisma.client.findUnique({
           where: {
            telefone: telefone
           }
        })

        const existCPF = await prisma.client.findUnique({
           where: {
            cpf: cpf
           }
        })

        const existPlan = await prisma.plano.findFirst({
           where: {
             id: plano_id,
             status: PlanStatus.ACTIVE
           }
        })

        if(!existPlan){
            throw new Error("Plano não cadastrado ou inativo/ARCHIVED")
        }

        if(existCPF){
            throw new Error("CPF já cadastrado!");
        }

        if (existEmail) {
        throw new Error("Email já cadastrado!");
        }

        if (existPhone) {
            throw new Error("Telefone já cadastrado!");
        }

        const createClientAssinatura = await prisma.$transaction(async (tx)=>{
            const createClient = await tx.client.create({
                data:{
                  nome: nome,
                  email:email,
                  cpf: cpf,
                  telefone:telefone
                },
                
            })

            const createAssinatura = await tx.assinatura.create({
                data:{
                    plano_id: plano_id,
                    client_id:createClient.id ,
                    proximo_vencimento: addDays(new Date(),30)
                }
            })

            return {createClient,createAssinatura}
        })


        return createClientAssinatura;
    }
}