import { FastifyPluginAsync } from "fastify";
import { webhookController } from "./webhook-controller";

export const webhookModule: FastifyPluginAsync = async (app, _opts) => {
  await app.register(webhookController, { prefix: "/v1/webhooks" });
};
