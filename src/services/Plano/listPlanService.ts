import { prisma } from '../../config/prisma';

export class ListPlanService {
  async execute() {
    const planList = await prisma.plano.findMany();

    return planList;
  }
}
