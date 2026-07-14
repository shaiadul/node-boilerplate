export class ApiResponse<T = unknown> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: T;
  public readonly meta?: unknown;

  constructor(data: T, message = 'Success', meta?: unknown) {
    this.success = true;
    this.message = message;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
  }
}
