import { AvailableResolutions, ErrorMessageResult } from "../types/types";
import { UpdateCurrentVideoProps } from "../types/requst-types";

export const getVideoValidateForCreate = (
  params: UpdateCurrentVideoProps,
  RequiredFieldsName: Partial<keyof UpdateCurrentVideoProps>[],
) => {
  const fieldErrors = new Map<string, string>();

  const receivedKeys = Object.keys(params);

  RequiredFieldsName.filter((requiredKey) => {
    // Проверяем наличие ключа
    if (!receivedKeys.includes(String(requiredKey))) {
      fieldErrors.set(
        String(requiredKey),
        `Отсутствует обязательный параметр ${String(requiredKey)}`,
      );
    }

    // Если ключ есть, проверяем его значение
    else if (!params?.[requiredKey]) {
      fieldErrors.set(
        String(requiredKey),
        `${String(requiredKey)} is required`,
      );
    }

    if (params?.title && params.title?.trim()?.length > 40) {
      fieldErrors.set("title", "Максимальная длинна title 40");
    }

    if (params?.author && params.author?.trim()?.length > 20) {
      fieldErrors.set("author", "Максимальная длинна title 20");
    }

    if (!params?.availableResolutions?.length) {
      fieldErrors.set(
        "availableResolutions",
        "Данные Available Resolutions обязательный параметр",
      );
    }

    if (params?.availableResolutions?.length) {
      const isNotContainsAvailableResolutionsFromDefault =
        params.availableResolutions?.filter((availableResolution) => {
          return (
            !Object.keys(AvailableResolutions).includes(availableResolution) &&
            !Object.values(AvailableResolutions).includes(availableResolution)
          );
        });

      if (isNotContainsAvailableResolutionsFromDefault?.length) {
        fieldErrors.set(
          "availableResolutions",
          `Данные Available Resolutions
           ${isNotContainsAvailableResolutionsFromDefault.join(",")} не состоят в списке Resolutions по умолчанию`,
        );
      }

      if (
        params.canBeDownloaded &&
        typeof params.canBeDownloaded !== "boolean"
      ) {
        fieldErrors.set(
          "canBeDownloaded",
          `Поле canBeDownloaded Должно быть Boolean`,
        );
      }

      if (params.minAgeRestriction && Number.isNaN(params.minAgeRestriction)) {
        fieldErrors.set(
          "minAgeRestriction",
          `Поле minAgeRestriction Должно быть Числовым`,
        );
      }

      if (
        (params.minAgeRestriction && Number(params.minAgeRestriction) < 1) ||
        Number(params.minAgeRestriction) > 18
      ) {
        fieldErrors.set(
          "minAgeRestriction",
          `Поле minAgeRestriction Должно быть Больше 1 и меньше 18`,
        );
      }
    }

    if (params?.publicationDate && params?.publicationDate) {
      const dateValue = Date.parse(params.publicationDate);

      if (isNaN(dateValue)) {
        fieldErrors.set(
          "publicationDate",
          `Поле publicationDate должно быть валидной датой в формате ISO 8601`,
        );
      }
    }
  });

  if (params?.publicationDate) {
    const date = new Date(params.publicationDate);

    // Проверяем, что это валидная дата
    if (isNaN(date.getTime())) {
      fieldErrors.set(
        "publicationDate",
        `Поле publicationDate должно быть валидной датой в формате ISO 8601`,
      );
    } else {
      // Проверяем, что строка содержит время (не только дату)
      const hasTime = /T\d{2}:\d{2}:\d{2}/.test(params.publicationDate);

      if (!hasTime) {
        fieldErrors.set(
          "publicationDate",
          `Поле publicationDate должно быть валидной датой в формате ISO 8601`,
        );
      }
    }
  }

  const errors: ErrorMessageResult = {
    errorsMessages: Array.from(fieldErrors.entries()).map(
      ([field, message]) => ({
        message,
        field,
      }),
    ),
  };

  return errors;
};
