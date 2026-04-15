import {prisma} from "../../config/prisma";

export class ListSignatureService {
    async execute(){
       return prisma.assinatura.findMany()
    }
}
