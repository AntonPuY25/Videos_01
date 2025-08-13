import request from 'supertest';
import express from 'express';
import { setupApp } from "../src/app";

describe('Videos Tests', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await request(app).delete('/testing/all-data').expect(204);
  });

  it(`should get all videos /videos'`, async () => {
    const resultVideos = await request(app)
      .get('/videos')
      .expect(200)

    expect(resultVideos.body.length).toBe(0);
    expect(Array.isArray(resultVideos.body)).toBe(true);
  });

});