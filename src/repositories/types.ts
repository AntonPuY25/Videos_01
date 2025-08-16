import { AvailableResolutions } from "../types/types";
import { UpdateCurrentVideoProps } from "../types/requst-types";

export interface CreateVideoForVideosRepository {
  title: string;
  author: string;
  availableResolutions: AvailableResolutions[];
}

export interface UpdateVideoForVideosRepository extends UpdateCurrentVideoProps {
  videoId: string;
}