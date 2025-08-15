import { AvailableResolutions, ErrorMessageResult } from "../types/types";
import { UpdateCurrentVideoProps } from "../types/requst-types";

export const getVideoValidateForCreate = (
  params: UpdateCurrentVideoProps,
  RequiredFieldsName: Partial<keyof UpdateCurrentVideoProps>[],
) => {
  let errors: ErrorMessageResult = {
    errorsMessages: [],
  };

  const receivedKeys = Object.keys(params);

  RequiredFieldsName.some((requiredKey) => {
    // Проверяем наличие ключа
    if (!receivedKeys.includes(String(requiredKey))) {
      errors.errorsMessages.push({
        message: `Отсутствует обязательный параметр ${String(requiredKey)}`,
        field: String(requiredKey),
      });

      return errors;
    }

    // Если ключ есть, проверяем его значение
    else if (!params?.[requiredKey]) {
      errors.errorsMessages.push({
        message: `${String(requiredKey)} is required`,
        field: String(requiredKey),
      });

      return errors;
    }

    if (params?.title && params.title?.trim()?.length > 40) {
      errors.errorsMessages.push({
        message: `Максимальная длинна title 40`,
        field: "title",
      });
    }

    if (params?.author && params.author?.trim()?.length > 20) {
      errors.errorsMessages.push({
        message: `Максимальная длинна author 20`,
        field: "author",
      });
    }

    if (!params?.availableResolutions?.length) {
      errors.errorsMessages.push({
        message: `Данные Available Resolutions обязательный параметр`,
        field: "availableResolutions",
      });

      return errors;
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
        errors.errorsMessages.push({
          message: `Данные Available Resolutions ${isNotContainsAvailableResolutionsFromDefault.join(",")}
          не состоят в списке Resolutions по умолчанию`,
          field: "availableResolutions",
        });

        return errors;
      }

      if (
        params.canBeDownloaded &&
        typeof params.canBeDownloaded !== "boolean"
      ) {
        errors.errorsMessages.push({
          message: `Поле canBeDownloaded Должно быть Boolean`,
          field: "canBeDownloaded",
        });

        return errors;
      }

      if (params.minAgeRestriction && Number.isNaN(params.minAgeRestriction)) {
        errors.errorsMessages.push({
          message: `Поле minAgeRestriction Должно быть Числовым`,
          field: "minAgeRestriction",
        });

        return errors;
      }

      if (
        (params.minAgeRestriction && Number(params.minAgeRestriction) < 1) ||
        Number(params.minAgeRestriction) > 18
      ) {
        errors.errorsMessages.push({
          message: `Поле minAgeRestriction Должно быть Больше 1 и меньше 18`,
          field: "minAgeRestriction",
        });

        return errors;
      }
    }

    if (params?.publicationDate && params?.publicationDate) {
      const dateValue = Date.parse(params.publicationDate);

      if (isNaN(dateValue)) {
        errors.errorsMessages.push({
          message: `Поле publicationDate должно быть валидной датой в формате ISO 8601`,
          field: "publicationDate",
        });

        return errors;
      }
    }
  });

  return errors;
};
