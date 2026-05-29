import type { ChatMessage } from '../data/simulation'

export type { ChatMessage }

const API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY)
const MODEL_NAME = 'gemini-flash-latest'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

export async function sendChatMessage(
  systemPrompt: string,
  history: ChatMessage[],
  newMessage: string,
): Promise<string> {
  const contents = [
    ...history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
    {
      role: 'user',
      parts: [{ text: newMessage }],
    },
  ]

  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents
    }),
  })

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`)
  }

  const data = (await response.json()) as {
    candidates: { content: { parts: { text: string }[] } }[]
  }

  return data.candidates[0].content.parts[0].text
}
