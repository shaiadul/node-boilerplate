import { Response } from 'express';
import { OrderService } from './order.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendResponse } from '../../utils/response';
import { ORDER_MESSAGES } from './order.constants';
import { getPaginationMeta } from '../../utils/pagination';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  create = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const order = await this.orderService.createOrder(req.user!.id, req.body);
    sendResponse(res, 201, order, ORDER_MESSAGES.CREATED);
  });

  getById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const order = await this.orderService.getOrderById(
      req.params.id as string,
      req.user!.id,
      req.user!.role
    );
    sendResponse(res, 200, order, ORDER_MESSAGES.FETCHED);
  });

  getMyOrders = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { data, total } = await this.orderService.getMyOrders(req.user!.id, req.query);
    const meta = getPaginationMeta(
      req.query.page as string,
      req.query.limit as string,
      total
    );
    sendResponse(res, 200, data, ORDER_MESSAGES.LISTED, meta);
  });

  getAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { data, total } = await this.orderService.getAllOrders(req.query);
    const meta = getPaginationMeta(
      req.query.page as string,
      req.query.limit as string,
      total
    );
    sendResponse(res, 200, data, ORDER_MESSAGES.LISTED, meta);
  });

  updateStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const order = await this.orderService.updateOrderStatus(
      req.params.id as string,
      req.body
    );
    sendResponse(res, 200, order, ORDER_MESSAGES.UPDATED);
  });
}
