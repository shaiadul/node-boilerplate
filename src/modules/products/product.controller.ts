import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendResponse } from '../../utils/response';
import { PRODUCT_MESSAGES } from './product.constants';
import { getPaginationMeta } from '../../utils/pagination';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  create = asyncHandler(async (req: Request, res: Response) => {
    const product = await this.productService.createProduct(req.body);
    sendResponse(res, 201, product, PRODUCT_MESSAGES.CREATED);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const product = await this.productService.getProductById(req.params.id as string);
    sendResponse(res, 200, product, PRODUCT_MESSAGES.FETCHED);
  });

  getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const product = await this.productService.getProductBySlug(req.params.slug as string);
    sendResponse(res, 200, product, PRODUCT_MESSAGES.FETCHED);
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { data, total } = await this.productService.getAllProducts(req.query);
    const meta = getPaginationMeta(
      req.query.page as string,
      req.query.limit as string,
      total
    );
    sendResponse(res, 200, data, PRODUCT_MESSAGES.LISTED, meta);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const product = await this.productService.updateProduct(
      req.params.id as string,
      req.body
    );
    sendResponse(res, 200, product, PRODUCT_MESSAGES.UPDATED);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const product = await this.productService.deleteProduct(req.params.id as string);
    sendResponse(res, 200, product, PRODUCT_MESSAGES.DELETED);
  });
}
