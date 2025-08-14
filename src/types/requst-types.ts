import { Request } from "express";

export interface GetCurrentVideoProps {
  id: string;
}

export interface RequestWithBody<T> extends Request<{}, {}, T> {}
export interface RequestWithParams<T> extends Request<T, {}, {}, {}> {}
