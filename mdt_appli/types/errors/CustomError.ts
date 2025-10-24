import { HttpStatus } from "../enums/http-status-enum";

export default class CustomError extends Error {
    status: HttpStatus;
    constructor(message: string, status: HttpStatus) {
        super(message);
        this.status = status;
    }
}
