import { Router, Response, Request } from "express";
import { Db } from "../db/db";

export const videosRouter = Router({});

videosRouter.get("/", (req: Request, res: Response) => {
  res.status(200).send(Db.videos);
});
