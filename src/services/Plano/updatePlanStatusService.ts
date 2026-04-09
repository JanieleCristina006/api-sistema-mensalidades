import { PlanStatus } from '@prisma/client';
import { prisma } from '../../config/prisma';

interface UpdateStatusPlanProps {
  status: PlanStatus
  id: number
}

export class UpdateStatusPlanService {
  async execute({ id,status }: UpdateStatusPlanProps) {


    const existPlan = await prisma.plano.findUnique({
        where:{
            id: id
        }
    })

    if(!existPlan){
        throw new Error("Plano não encontrado!")
    }

    const updateStatusPlan = await prisma.plano.update({
      where:{
       id:id
      },
      data: {
        status: status
      }
    })

    return updateStatusPlan;
  }
}


