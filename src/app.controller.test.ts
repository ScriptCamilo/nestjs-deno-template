import { Test, type TestingModule } from "@nestjs/testing";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it('should return "Hello World, from Deno Deploy with NestJS!"', () => {
      expect(appController.getHello()).toBe(
        "Hello World, from Deno Deploy with NestJS!",
      );
    });
  });
});
