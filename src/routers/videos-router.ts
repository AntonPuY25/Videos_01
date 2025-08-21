import { Request, Response, Router } from "express";
import {
  GetCurrentVideoProps,
  RequestWithBody,
  RequestWithBodyAndParams,
  RequestWithParams,
  UpdateCurrentVideoProps,
} from "../types/requst-types";
import { CreateVideoRequestType } from "../types/types";
import { videosRepository } from "../repositories/videos-repository";
import {
  authorLengthForVideoValidate,
  authorRequiredForVideoValidate,
  availableCoincidenceResolutionsValidate, availableDateResolutionsValidate,
  availableRequiredResolutionsValidate,
  canBeDownloadedShouldBeBooleanTypeForVideoValidate,
  getValidationErrors,
  minAgeRestrictionShouldBeNumberAndCheckAgeTypeForVideoValidate,
  minAgeRestrictionShouldBeNumberTypeForVideoValidate,
  titleLengthForVideoValidate,
  titleRequiredForVideoValidate
} from "../middleWares/validate-middleWare";

export const videosRouter = Router({});

videosRouter.get("/", (req: Request, res: Response) => {
  const allVideos = videosRepository.getAllVideos();

  res.status(200).send(allVideos);
});

videosRouter.post(
  "/",
  titleRequiredForVideoValidate,
  authorRequiredForVideoValidate,
  availableRequiredResolutionsValidate,
  titleLengthForVideoValidate,
  authorLengthForVideoValidate,
  availableCoincidenceResolutionsValidate,
  getValidationErrors,
  (req: RequestWithBody<CreateVideoRequestType>, res: Response) => {
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
    const currentVideoId = req.params.id as string;

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
  // Сначала валидация полей, потом обработка ошибок
  titleRequiredForVideoValidate,
  authorRequiredForVideoValidate,
  availableRequiredResolutionsValidate,
  titleLengthForVideoValidate,
  authorLengthForVideoValidate,
  availableCoincidenceResolutionsValidate,
  canBeDownloadedShouldBeBooleanTypeForVideoValidate,
  minAgeRestrictionShouldBeNumberTypeForVideoValidate,
  minAgeRestrictionShouldBeNumberAndCheckAgeTypeForVideoValidate,
  availableDateResolutionsValidate,
  getValidationErrors,
  (
    req: RequestWithBodyAndParams<
      GetCurrentVideoProps,
      UpdateCurrentVideoProps
    >,
    res: Response,
  ) => {
    const currentVideoId = req.params.id || "";

    const updatedVideoResult = videosRepository.updateVideoById({
      videoId: currentVideoId,
      ...req.body,
    });

    if (!updatedVideoResult) {
      res.sendStatus(404);

      return;
    }

    res.sendStatus(204);
  },
);

videosRouter.delete(
  "/:id",
  (req: RequestWithParams<GetCurrentVideoProps>, res: Response) => {
    const currentVideoId = req.params.id as string;

    const deletedVideoResult = videosRepository.deleteVideoById(currentVideoId);

    if (deletedVideoResult) {
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  },
);
