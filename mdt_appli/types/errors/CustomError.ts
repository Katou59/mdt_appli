import { HttpStatus } from "../enums/httpStatus";

export default class CustomError extends Error {
    status: HttpStatus;
    constructor(message: string, status: HttpStatus) {
        super(message);
        this.status = status;
    }
}
