import {
  AvailableResolutions,
  CreateVideoRequestType,
  ErrorMessageResult,
} from "../types/types";

export const getVideoValidateForCreate = (params: CreateVideoRequestType) => {
  let errors: ErrorMessageResult = {
    errorsMessages: [],
  };

  const requiredKeys: Array<keyof CreateVideoRequestType> = [
    "title",
    "author",
    "availableResolutions",
  ];

  const receivedKeys = Object.keys(params);

  requiredKeys.forEach((requiredKey) => {
    // Проверяем наличие ключа
    if (!receivedKeys.includes(String(requiredKey))) {
      errors.errorsMessages.push({
        message: `Отсутствует обязательный параметр ${String(requiredKey)}`,
        field: String(requiredKey),
      });
    }

    // Если ключ есть, проверяем его значение
    else if (!params[requiredKey]) {
      errors.errorsMessages.push({
        message: `${String(requiredKey)} is required`,
        field: String(requiredKey),
      });
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
    }

    if (params?.availableResolutions?.length) {
      const isNotContainsAvailableResolutionsFromDefault =
        params.availableResolutions?.filter((availableResolution) => {
          return !Object.values(AvailableResolutions).includes(
            availableResolution,
          );
        });

      if (isNotContainsAvailableResolutionsFromDefault?.length) {
        errors.errorsMessages.push({
          message: `Данные Available Resolutions ${isNotContainsAvailableResolutionsFromDefault.join(",")}
          не состоят в списке Resolutions по умолчанию`,
          field: "availableResolutions",
        });
      }
    }
  });

  return errors;
};
