import { Request } from "express";

export interface RequestWithBody<T> extends Request<{},{},T> {}