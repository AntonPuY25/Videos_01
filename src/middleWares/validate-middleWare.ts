import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { AvailableResolutions } from "../types/types";

export const getValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
  }

  const result = errors.array().map(({ msg }) => {
    return msg;
  });

  res.status(400).send({ errorsMessages: result });
};

export const titleRequiredForVideoValidate = body("title")
  .notEmpty()
  .withMessage({
    message: "Title is required",
    field: "title",
  });

export const authorRequiredForVideoValidate = body("author")
  .notEmpty()
  .withMessage({
    message: "Author is required",
    field: "author",
  });

export const availableRequiredResolutionsValidate = body("availableResolutions")
  .notEmpty()
  .withMessage({
    message: "AvailableResolutions is required",
    field: "availableResolutions",
  });

export const titleLengthForVideoValidate = body("title")
  .isLength({ max: 40 })
  .withMessage({
    message: "Title is max Length 40",
    field: "title",
  });

export const authorLengthForVideoValidate = body("author")
  .isLength({ max: 20 })
  .withMessage({
    message: "Author is max Length 20",
    field: "author",
  });

export const availableCoincidenceResolutionsValidate = body(
  "availableResolutions",
)
  .isArray()
  .custom((availableResolutions: AvailableResolutions[]) => {
    const isNotContainsAvailableResolutionsFromDefault =
      availableResolutions?.filter((availableResolution) => {
        return (
          !Object.keys(AvailableResolutions).includes(availableResolution) &&
          !Object.values(AvailableResolutions).includes(availableResolution)
        );
      });

    if (!availableResolutions.length) {
      throw new Error("availableResolutions is empty");
    }

    if (isNotContainsAvailableResolutionsFromDefault?.length) {
      throw new Error(
        `Invalid resolutions: ${isNotContainsAvailableResolutionsFromDefault.join(", ")}`,
      );
    }

    return true;
  })
  .withMessage({
    message:
      "AvailableResolutions should contain only allowed resolution values",
    field: "availableResolutions",
  });

export const canBeDownloadedShouldBeBooleanTypeForVideoValidate = body(
  "canBeDownloaded",
)
  .isBoolean()
  .withMessage({
    message: `Поле canBeDownloaded Должно быть Boolean`,
    field: "canBeDownloaded",
  });

export const minAgeRestrictionShouldBeNumberTypeForVideoValidate = body(
  "minAgeRestriction",
)
  .isNumeric()
  .withMessage({
    message: `Поле minAgeRestriction Должно быть Number`,
    field: "minAgeRestriction",
  });

export const minAgeRestrictionShouldBeNumberAndCheckAgeTypeForVideoValidate =
  body("minAgeRestriction").isNumeric().isInt({ min: 1, max: 18 }).withMessage({
    message: `Поле minAgeRestriction Должно быть Больше 1 и меньше 18`,
    field: "minAgeRestriction",
  });

export const availableDateResolutionsValidate = body("publicationDate")
  .notEmpty()
  .isString()
  .custom((publicationDate: string) => {
    // Проверяем точный формат ISO 8601 как у toISOString()
    const isoStringRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

    if (!isoStringRegex.test(publicationDate)) {
      throw new Error(
        `Поле publicationDate должно быть в формате ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)`,
      );
    }

      const dateValue = Date.parse(publicationDate);

      if (isNaN(dateValue)) {
        throw new Error(
          `Поле publicationDate должно быть в формате ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)`,
        );
      }


    const date = new Date(publicationDate);

    // Проверяем, что это валидная дата
    if (isNaN(date.getTime())) {
      throw new Error(
        `Поле publicationDate должно быть в формате ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)`,
      );
    }

    return true;
  })
  .withMessage({
    message: `Поле publicationDate должно быть в формате ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)`,
    field: "publicationDate",
  });
