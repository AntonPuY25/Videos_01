import express, { Express } from "express";
import { videosRouter } from "./routers/videos-router";
import { testRouter } from "./routers/test.router";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.use("/videos", videosRouter);
  app.use("/testing", testRouter);

  return app;
};
