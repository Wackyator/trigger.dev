import { client } from "@/trigger";
import { Job, eventTrigger } from "@trigger.dev/sdk";
import { z } from "zod";

new Job(client, {
  id: "test-event-trigger-1",
  name: "Test Event Trigger 1",
  version: "0.0.1",
  logLevel: "debug",
  trigger: eventTrigger({
    name: "test-event-trigger-1",
    schema: z.object({
      name: z.string(),
      payload: z.any(),
    }),
  }),
  run: async (payload, io, ctx) => {
    await io.sendEvent(
      "send",
      {
        name: payload.name,
        payload: payload.payload,
        timestamp: new Date(),
      },
      { deliverAt: new Date(Date.now() + 1000 * 30) }
    );
  },
});
