import {prisma} from "../../config/prisma"


export class GetClientByIdService{
    async execute( id : number){
        
        if(!id){
            throw new Error("Usúario não encontrado!")
        }

        const searchClient = prisma.client.findUnique({
            where: {
                id: id
            }
        })

        return searchClient;
    }
}