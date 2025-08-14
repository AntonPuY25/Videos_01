import { Request, Response, Router } from "express";
import { Db } from "../db/db";
import {
  GetCurrentVideoProps,
  RequestWithBody,
  RequestWithParams,
} from "../types/requst-types";
import { CreateVideoRequestType, VideoType } from "../types/types";
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

    const { title, author, availableResolutions } = req.body;

    if (title && author && availableResolutions) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const newVideo: VideoType = {
        id: new Date().getMilliseconds(),
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toString(),
        publicationDate: tomorrow.toString(),
        availableResolutions,
      };

      Db.videos.push(newVideo);

      res.status(201).send(newVideo);
    }
  },
);

videosRouter.get(
  "/:id",
  (req: RequestWithParams<GetCurrentVideoProps>, res: Response) => {
    const currentVideoId = req.params.id;

    const currentVideo = Db.videos.find(
      (video) => video.id === Number(currentVideoId),
    );

    console.log(currentVideo,'currentVideo');

    if (currentVideo) {
      res.status(200).send(currentVideo);
    } else {
      res.status(404);
    }
  },
);
