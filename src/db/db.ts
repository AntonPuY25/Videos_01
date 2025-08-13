import { AvailableResolutions, BdStateType } from "../types/types";

export const Db:BdStateType = {
  videos: [
    {
      id: 1,
      title: "Гарри Потер",
      author: "Дж.К. Роулинг",
      canBeDownloaded: false,
      minAgeRestriction: 16,
      createdAt: "2025-08-13T17:22:16.116Z",
      publicationDate: "2025-08-14T17:22:16.116Z",
      availableResolutions: AvailableResolutions.P144
    },
    {
      id: 2,
      title: "Форсаж",
      author: "ДГэри Скотт Томпсон",
      canBeDownloaded: false,
      minAgeRestriction: 18,
      createdAt: "2025-09-16T17:22:16.116Z",
      publicationDate: "2025-08-17T17:22:16.116Z",
      availableResolutions: AvailableResolutions.P2160
    }
  ]
}