import { Request, Response } from 'express';
import { ListPlanService } from '../../services/Plano/listPlanService';

export class ListPlanController {
  async handle(_req: Request, res: Response) {
    const service = new ListPlanService();

    const data = await service.execute();

    if (!data) {
      throw new Error('Erro ao buscar lista de planos');
    }

    res.status(200).json(data);
  }
}
