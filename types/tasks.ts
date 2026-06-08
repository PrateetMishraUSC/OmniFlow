import { z } from "zod"

export const AiStatusFeedPayloadSchema = z.object({
  text: z.string().optional(),
  status: z.enum(["thinking", "processing", "applying", "done", "error"]).optional(),
})

export type AiStatusFeedPayload = z.infer<typeof AiStatusFeedPayloadSchema>

export const ChatMessageSchema = z.object({
  sender: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.number(),
})

export type ChatMessage = z.infer<typeof ChatMessageSchema>
