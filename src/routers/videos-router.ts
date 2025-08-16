import { Request, Response, Router } from "express";
import {
  GetCurrentVideoProps,
  RequestWithBody,
  RequestWithBodyAndParams,
  RequestWithParams,
  UpdateCurrentVideoProps,
} from "../types/requst-types";
import { CreateVideoRequestType } from "../types/types";
import { getVideoValidateForCreate } from "../validators/videos-vallidator";
import { videosRepository } from "../repositories/videos-repository";

export const videosRouter = Router({});

videosRouter.get("/", (req: Request, res: Response) => {
  const allVideos = videosRepository.getAllVideos();

  res.status(200).send(allVideos);
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
      const newVideo = videosRepository.createVideo({
        title,
        author,
        availableResolutions,
      });

      res.status(201).send(newVideo);
    }
  },
);

videosRouter.get(
  "/:id",
  (req: RequestWithParams<GetCurrentVideoProps>, res: Response) => {
    const currentVideoId = req.params.id;

    const currentVideo = videosRepository.findCurrentVideoById(currentVideoId);

    if (currentVideo) {
      res.status(200).send(currentVideo);
    } else {
      res.sendStatus(404);
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

    const updatedVideoResult = videosRepository.updateVideoById({
      videoId: currentVideoId,
      ...req.body,
    });

    if (!updatedVideoResult) {
      res.sendStatus(404);

      return;
    }

    const body = req.body;

    const errors = getVideoValidateForCreate(body, requiredKeys);

    if (errors.errorsMessages.length) {
      res.status(400).send(errors);

      return;
    }

    res.sendStatus(204);
  },
);

videosRouter.delete(
  "/:id",
  (req: RequestWithParams<GetCurrentVideoProps>, res: Response) => {
    const currentVideoId = req.params.id;

    const deletedVideoResult = videosRepository.deleteVideoById(currentVideoId);

    if (deletedVideoResult) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  },
);
