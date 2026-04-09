import {prisma} from "../../config/prisma";

export class SignatureService {
    async execute(){
       return prisma.assinatura.findMany()
    }
}
