import { prisma } from "../../config/prisma"

export class listClientService{
    async execute(){

        const searchData = await prisma.client.findMany()

        return searchData;
    }
}
