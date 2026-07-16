import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import type { App } from "supertest/types";
import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";

import { AppModule } from "@/app.module.ts";

describe("AppController (e2e)", () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/ (GET)", () => {
    request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Hello World!");
  });

  afterEach(async () => {
    await app.close();
  });
});
