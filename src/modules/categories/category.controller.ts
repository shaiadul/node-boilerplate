import { Request, Response } from 'express';
import { CategoryService } from './category.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendResponse } from '../../utils/response';
import { CATEGORY_MESSAGES } from './category.constants';
import { getPaginationMeta } from '../../utils/pagination';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  create = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.categoryService.createCategory(req.body);
    sendResponse(res, 201, category, CATEGORY_MESSAGES.CREATED);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.categoryService.getCategoryById(req.params.id as string);
    sendResponse(res, 200, category, CATEGORY_MESSAGES.FETCHED);
  });

  getBySlug = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.categoryService.getCategoryBySlug(req.params.slug as string);
    sendResponse(res, 200, category, CATEGORY_MESSAGES.FETCHED);
  });

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const { data, total } = await this.categoryService.getAllCategories(req.query);
    const meta = getPaginationMeta(
      req.query.page as string,
      req.query.limit as string,
      total
    );
    sendResponse(res, 200, data, CATEGORY_MESSAGES.LISTED, meta);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.categoryService.updateCategory(
      req.params.id as string,
      req.body
    );
    sendResponse(res, 200, category, CATEGORY_MESSAGES.UPDATED);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const category = await this.categoryService.deleteCategory(req.params.id as string);
    sendResponse(res, 200, category, CATEGORY_MESSAGES.DELETED);
  });
}
