import request from "supertest";
import express from "express";
import { setupApp } from "../src/app";
import {
  AvailableResolutions,
  CreateVideoRequestType,
} from "../src/types/types";

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
});
