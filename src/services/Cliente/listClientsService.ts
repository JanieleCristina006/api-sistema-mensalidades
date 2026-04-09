import { prisma } from "../../config/prisma"

export class listClientService{
    async execute(){

        const searchData = await prisma.client.findMany({
            include:{
                assinaturas: true
            }
        })

        return searchData;
    }
}
