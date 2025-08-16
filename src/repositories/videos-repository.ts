import { Db } from "../db/db";
import {
  CreateVideoForVideosRepository,
  UpdateVideoForVideosRepository,
} from "./types";
import { VideoType } from "../types/types";

export const videosRepository = {
  findCurrentVideoById: (videoId: string) => {
    return Db.videos.find((video) => video.id === Number(videoId));
  },

  getAllVideos: () => Db.videos,

  createVideo: ({
    title,
    author,
    availableResolutions,
  }: CreateVideoForVideosRepository) => {
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    const newVideo: VideoType = {
      id: new Date().getMilliseconds(),
      title,
      author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: tomorrow.toISOString(),
      availableResolutions,
    };

    Db.videos.push(newVideo);

    return newVideo;
  },

  updateVideoById: ({
    title,
    canBeDownloaded,
    author,
    availableResolutions,
    minAgeRestriction,
    publicationDate,
    videoId,
  }: UpdateVideoForVideosRepository) => {
    const currentVideo = Db.videos?.find(
      (video) => video.id === Number(videoId),
    );

    if (!currentVideo) {
      return false;
    }

    const updatedVideo: VideoType = {
      id: Number(videoId),
      author: author || currentVideo.author,
      availableResolutions:
        availableResolutions || currentVideo.availableResolutions,
      title: title || currentVideo.title,
      canBeDownloaded: canBeDownloaded || currentVideo.canBeDownloaded,
      createdAt: currentVideo.createdAt,
      minAgeRestriction: minAgeRestriction || currentVideo.minAgeRestriction,
      publicationDate: publicationDate || currentVideo.publicationDate,
    };

    // Находим индекс и заменяем элемент
    const videoIndex = Db.videos.findIndex(
      (video) => video.id === Number(videoId),
    );

    if (videoIndex !== -1) {
      Db.videos[videoIndex] = updatedVideo;

      return true;
    }

  },

  deleteVideoById: (videoId: string) => {
    const currentVideoIndex = Db.videos.findIndex(
      (video) => video.id === Number(videoId),
    );
    if (currentVideoIndex !== undefined && currentVideoIndex !== -1) {
      Db.videos.splice(currentVideoIndex, 1);

      return true;
    }else{
      return false;
    }


  }
};
