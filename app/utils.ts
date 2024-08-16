export type Result<T> = {
  data?: T;
  error?: any;
  message?: string;
  statusCode?: number;
};
export function makeResult<T>(result: Result<T>): Result<T> {
  return result;
}