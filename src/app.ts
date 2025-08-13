import express, { Express } from "express";
import { videosRouter } from "./routers/videos-router";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.use("/videos", videosRouter);

  return app;
};
