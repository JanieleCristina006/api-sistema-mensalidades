
import { prisma } from '../../config/prisma';

interface UpdatePlanProps {
  id: number
  nome: string;
  preco: string;
 
}

export class UpdatePlanService {
  async execute({ nome, preco, id }: UpdatePlanProps) {

    const normalizedName = nome.toLowerCase().trim()

    const existPlan = await prisma.plano.findUnique({
        where:{
            id: id
        }
    })

    if(!existPlan){
        throw new Error("Plano não encontrado!")
    }

    const updatePlan = await prisma.plano.update({
      where:{
       id:id
      },
      data: {
        nome: normalizedName,
        preco,
      }
    })

    return updatePlan;
  }
}


