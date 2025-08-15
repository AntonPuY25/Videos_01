import request from "supertest";
import express from "express";
import { setupApp } from "../src/app";
import {
  AvailableResolutions,
  CreateVideoRequestType,
} from "../src/types/types";
import { UpdateCurrentVideoProps } from "../src/types/requst-types";

describe("Videos Tests", () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await request(app).delete("/testing/all-data").expect(204);
  });

  it(`should create new video'`, async () => {
    const dataForNewVideo: CreateVideoRequestType = {
      title: "Супермен",
      author: "Джерри Сигел",
      availableResolutions: [AvailableResolutions.P720],
    };

    const createdVideo = await request(app)
      .post("/videos")
      .send(dataForNewVideo)
      .expect(201);

    expect(createdVideo.body.title).toBe(dataForNewVideo.title);
    expect(createdVideo.body.author).toBe(dataForNewVideo.author);
    expect(Array.isArray(createdVideo.body.availableResolutions)).toBeTruthy();

    const resultVideos = await request(app)
      .get(`/videos/${createdVideo.body.id}`)
      .expect(200);

    expect(resultVideos.body.title).toBe(dataForNewVideo.title);
  });

  it(`should  get error for create new video with large author '`, async () => {
    const wrongDataForNewVideo: CreateVideoRequestType = {
      title: "Супермен",
      author:
        "Джерри СигелДжерри СигелДжерри СигелДжерри СигелДжерри СигелДжерри" +
        " СигелДжерри СигелДжерри СигелДжерри СигелДжерри Сигел",
      availableResolutions: [AvailableResolutions.P720],
    };

    await request(app).post("/videos").send(wrongDataForNewVideo).expect(400);
  });

  it(`should  get error for create new video without title'`, async () => {
    const wrongDataForNewVideo = {
      author: "Джерри Сигел",
      availableResolutions: [AvailableResolutions.P720],
    };

    await request(app).post("/videos").send(wrongDataForNewVideo).expect(400);
  });

  it(`should  get error for  new video with empry availableResolutions'`, async () => {
    const wrongDataForNewVideo = {
      title: "Супермен",
      author: "Джерри Сигел",
      availableResolutions: [],
    };

    await request(app).post("/videos").send(wrongDataForNewVideo).expect(400);
  });

  it(`should create new video and than update it'`, async () => {
    await request(app).delete("/testing/all-data").expect(204);

    const dayAfterDay = new Date();
    dayAfterDay.setDate(dayAfterDay.getDate() + 12);

    const dataForNewVideo: CreateVideoRequestType = {
      title: "Властелин колец",
      author: "Джон Рональд Руэл",
      availableResolutions: [
        AvailableResolutions.P720,
        AvailableResolutions.P2160,
      ],
    };

    const dataForUpdateVideo: UpdateCurrentVideoProps = {
      title: "Властелин колец 2",
      author: "Джон Рональд Руэл",
      availableResolutions: [
        AvailableResolutions.P720,
        AvailableResolutions.P2160,
        AvailableResolutions.P144,
      ],
      publicationDate: dayAfterDay.toString(),
      minAgeRestriction: 12,
      canBeDownloaded: true,
    };

    const createdVideo = await request(app)
      .post("/videos")
      .send(dataForNewVideo)
      .expect(201);

    expect(createdVideo.body.title).toBe(dataForNewVideo.title);
    expect(createdVideo.body.author).toBe(dataForNewVideo.author);
    expect(Array.isArray(createdVideo.body.availableResolutions)).toBeTruthy();

    const createdVideoId = createdVideo.body.id;

    const resultVideos = await request(app)
      .get(`/videos/${createdVideoId}`)
      .expect(200);

    expect(resultVideos.body.title).toBe(dataForNewVideo.title);

    await request(app)
      .put(`/videos/${createdVideoId}`)
      .send(dataForUpdateVideo)
      .expect(204);

    const resultVideosAfterUpdate = await request(app)
      .get(`/videos/${createdVideoId}`)
      .expect(200);

    expect(resultVideosAfterUpdate.body.title).toBe(dataForUpdateVideo.title);
  });
});
