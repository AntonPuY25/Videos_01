import { Request, Response, Router } from "express";
import { Db } from "../db/db";
import {
  GetCurrentVideoProps,
  RequestWithBody,
  RequestWithBodyAndParams,
  RequestWithParams,
  UpdateCurrentVideoProps,
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
    const requiredKeys: Partial<keyof UpdateCurrentVideoProps>[] = [
      "title",
      "author",
      "availableResolutions",
    ];

    const errors = getVideoValidateForCreate(req.body, requiredKeys);

    if (errors.errorsMessages.length) {
      res.status(400).send(errors);

      return;
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

    console.log(currentVideo, "currentVideo");

    if (currentVideo) {
      res.status(200).send(currentVideo);
    } else {
      res.status(404);
    }
  },
);

videosRouter.put(
  "/:id",
  (
    req: RequestWithBodyAndParams<
      GetCurrentVideoProps,
      UpdateCurrentVideoProps
    >,
    res: Response,
  ) => {
    const requiredKeys: Partial<keyof UpdateCurrentVideoProps>[] = [
      "title",
      "author",
      "availableResolutions",
      "canBeDownloaded",
      "minAgeRestriction",
      "publicationDate",
    ];

    const currentVideoId = req.params.id;

    const currentVideo = Db.videos.find(
      (video) => video.id === Number(currentVideoId),
    );

    if (!currentVideo) {
      res.sendStatus(404);

      return;
    }
    const body = req.body;

    const errors = getVideoValidateForCreate(body, requiredKeys);

    if (errors.errorsMessages.length) {
      res.status(400).send(errors);

      return;
    }

    const updatedVideo: VideoType = {
      id: currentVideo.id,
      author: body.author || currentVideo.author,
      availableResolutions:
        body.availableResolutions || currentVideo.availableResolutions,
      title: body.title || currentVideo.title,
      canBeDownloaded: body.canBeDownloaded || currentVideo.canBeDownloaded,
      createdAt: currentVideo.createdAt,
      minAgeRestriction:
        body.minAgeRestriction || currentVideo.minAgeRestriction,
      publicationDate: body.publicationDate || currentVideo.publicationDate,
    };

    // Находим индекс и заменяем элемент
    const videoIndex = Db.videos.findIndex(video => video.id === Number(currentVideoId));

    if (videoIndex !== -1) {
      Db.videos[videoIndex] = updatedVideo;
    }

    res.sendStatus(204);
  },
);
