import { z } from "zod";

export const zExtendedTaskObject = z.object({
  id: z.number(),
  messageId: z.string(),
  content: z.string(),
  status: z.enum(["TODO", "DOING", "DONE"]), // hardcoded for now
  createdAt: z.date(),
  channel: z.object({
    id: z.string(),
    channelName: z.string(),
    categoryName: z.string(),
  }),
  user: z.object({
    id: z.number(),
    clerkId: z.string().nullable(),
    discordId: z.string().nullable(),
    name: z.string(),
    // profileUrl: z.string().nullable(),
  }),
});
