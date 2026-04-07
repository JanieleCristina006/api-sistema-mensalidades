import {prisma} from "../../config/prisma"


interface createClientProps{
    email:    string
    nome:     string
    cpf :     string
    telefone: string
}

export class createClientService{
    async execute({nome,email,cpf,telefone}:createClientProps){

        const existEmail = await prisma.client.findUnique({
            where: {
                email: email
            }
        })

         const existPhone = await prisma.client.findFirst({
           where: {
            telefone: telefone
           }
        })

        if (existEmail && existPhone) {
            throw new Error("Telefone e email já cadastrado!");
        }

        if (existEmail) {
        throw new Error("Email já cadastrado!");
        }

        if (existPhone) {
            throw new Error("Telefone já cadastrado!");
        }

        const createClient = await prisma.client.create({
            data:{
                nome: nome,
                email:email,
                cpf: cpf,
                telefone:telefone
            },
            include:{
                assinaturas: true
            }
        })

        return createClient;
    }
}