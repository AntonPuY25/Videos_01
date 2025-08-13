import { Router, Response, Request } from "express";
import { Db } from "../db/db";
import { videosRouter } from "./videos-router";

export const testRouter = Router({});

testRouter.delete("/all-data", (req: Request, res: Response) => {
  Db.videos = [];

  res.status(204).send("All data is deleted");
});
