export interface ErrorLogToAddType {
    path: string,
    request: object | null,
    error: obj | null,
    userId: string,
    method: string,
}