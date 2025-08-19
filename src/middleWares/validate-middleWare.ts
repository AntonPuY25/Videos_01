import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

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

  res.send({ errorsMessages: result });
};

export const titleForVideoValidate = body("title").notEmpty().withMessage({
  message: "Title is required",
  field: "title",
});
