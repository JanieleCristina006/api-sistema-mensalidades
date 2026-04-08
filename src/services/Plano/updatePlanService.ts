import { PlanStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';

interface CreatePlanProps {
  id: number
  nome: string;
  preco: string;
  status?: PlanStatus; 
}

export class UpdatePlanService {
  async execute({ nome, preco, status = PlanStatus.ACTIVE,id }: CreatePlanProps) {

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
        status
      }
    })

    return updatePlan;
  }
}


