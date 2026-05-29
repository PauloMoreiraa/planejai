import { useState } from 'react'

import { buildChatSystemPrompt } from '../data/chatPrompt'
import type { SimulationRecord } from '../data/simulation'
import { type ChatMessage, sendChatMessage } from '../services/chatService'

export function useChat(simulation: SimulationRecord) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const systemPrompt = buildChatSystemPrompt(simulation)

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: ChatMessage = { role: 'user', text }
    const updatedHistory = [...messages, userMessage]
    setMessages(updatedHistory)
    setIsLoading(true)
    setError(null)

    try {
      const reply = await sendChatMessage(systemPrompt, messages, text)
      setMessages([...updatedHistory, { role: 'model', text: reply }])
    } catch {
      setError('Erro ao obter resposta. Tente novamente.')
      // Remove a mensagem do usuário em caso de erro
      setMessages(messages)
    } finally {
      setIsLoading(false)
    }
  }

  return { messages, isLoading, error, sendMessage }
}
