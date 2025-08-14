import { Request } from "express";
import { AvailableResolutions } from "./types";

export interface GetCurrentVideoProps {
  id: string;
}

export interface UpdateCurrentVideoProps {
  title?: string;
  author?: string;
  canBeDownloaded?: boolean;
  minAgeRestriction?: null | number;
  publicationDate?: string;
  availableResolutions?: AvailableResolutions[];
}

export interface RequestWithBody<T> extends Request<{}, {}, T> {}
export interface RequestWithBodyAndParams<T, J> extends Request<T, {}, J> {}
export interface RequestWithParams<T> extends Request<T, {}, {}, {}> {}
