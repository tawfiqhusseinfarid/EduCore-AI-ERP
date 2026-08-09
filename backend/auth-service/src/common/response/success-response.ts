import { ApiResponse } from './api-response';

export class SuccessResponse<T> extends ApiResponse<T> {
  constructor(
    message: string,
    data?: T,
  ) {
    super(true, message, data);
  }
}