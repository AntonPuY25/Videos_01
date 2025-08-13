import { Request, Response, Router } from "express";
import { Db } from "../db/db";
import { RequestWithBody } from "../types/requst-types";
import { CreateVideoRequestType } from "../types/types";
import { getVideoValidateForCreate } from "../validators/videos-vallidator";

export const videosRouter = Router({});

videosRouter.get("/", (req: Request, res: Response) => {
  res.status(200).send(Db.videos);
});

videosRouter.post(
  "/",
  (req: RequestWithBody<CreateVideoRequestType>, res: Response) => {
    const errors = getVideoValidateForCreate(req.body);

    if (errors.errorsMessages.length) {
      res.status(400).send(errors.errorsMessages);
    }

    res.status(201).send(Db.videos);
  },
);
