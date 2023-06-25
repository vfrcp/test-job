export interface ICustomError extends Error {
  isCustomError: true,
  httpStatus: number
}