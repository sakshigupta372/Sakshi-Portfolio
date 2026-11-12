// Vercel serverless function → /api/chat. Logic lives in /server/chat.js.
import { handleChat } from '../server/chat.js'

export default function handler(req, res) {
  return handleChat(req, res)
}
