import { PlanStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';

interface CreatePlanProps {
  nome: string;
  preco: string;
  status?: PlanStatus; 
}

class CreatePlanService {
  async execute({ nome, preco, status = PlanStatus.ACTIVE }: CreatePlanProps) {

    const normalizedName = nome.toLowerCase().trim()

    const existPlan = await prisma.plano.findUnique({
      where:{
        nome: normalizedName
      }
    })

    if(existPlan){
        throw new Error("O plano já existe!")
    }

    const createPlan = await prisma.plano.create({
      data: {
        nome:normalizedName,
        preco,
        status,
      },

    });


    return createPlan;
  }
}

export { CreatePlanService };
