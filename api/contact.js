// Vercel serverless function → /api/contact. Logic lives in /server/contact.js.
import { handleContact } from '../server/contact.js'

export default function handler(req, res) {
  return handleContact(req, res)
}
