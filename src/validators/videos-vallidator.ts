import { CreateVideoRequestType, ErrorMessageResult } from "../types/types";

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
  });

  return errors;
};
