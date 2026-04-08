import { prisma } from '../../config/prisma';

export class ListPlanService {
  async execute() {
    const searchData = await prisma.plano.findMany();

    return searchData;
  }
}
