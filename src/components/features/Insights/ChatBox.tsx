import { ArrowUp, Bot, Loader2, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import type { SimulationRecord } from '../../../data/simulation'
import { useChat } from '../../../hooks/useChat'

interface ChatBoxProps {
  simulation: SimulationRecord
}

const SUGGESTED_QUESTIONS = [
  'Como posso economizar mais?',
  'Minha meta é viável?',
  'Sugestões de investimentos?',
]

export function ChatBox({ simulation }: ChatBoxProps) {
  const { messages, isLoading, error, sendMessage } = useChat(simulation)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSubmit = async (text?: string) => {
    const msg = text ?? input
    if (!msg.trim() || isLoading) return
    setInput('')
    await sendMessage(msg)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSubmit()
    }
  }

  return (
    <div className="flex flex-col">
      {/* Divisor */}
      <div className="mb-4 flex items-center gap-3">
        <div className="bg-muted-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
          <Bot size={14} className="text-primary" />
        </div>
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Converse com a IA
        </span>
      </div>

      {/* Área de mensagens */}
      <div className="scrollbar-thin [scrollbar-color:var(--border)_transparent] mb-3 flex min-h-[180px] max-h-[320px] flex-col gap-3 overflow-y-auto rounded-xl p-3">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
            <div className="bg-muted-primary mb-3 flex h-10 w-10 items-center justify-center rounded-xl">
              <Bot size={20} className="text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">
              Tire suas dúvidas sobre essa simulação com a IA
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={['flex gap-2.5', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'].join(' ')}
          >
            {/* Avatar */}
            <div
              className={[
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                msg.role === 'user' ? 'bg-primary' : 'bg-muted-primary',
              ].join(' ')}
            >
              {msg.role === 'user' ? (
                <User size={14} className="text-primary-foreground" />
              ) : (
                <Bot size={14} className="text-primary" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={[
                'max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-sm'
                  : 'bg-card text-foreground border border-(--border) rounded-tl-sm',
              ].join(' ')}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Loading bubble */}
        {isLoading && (
          <div className="flex gap-2.5">
            <div className="bg-muted-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
              <Bot size={14} className="text-primary" />
            </div>
            <div className="bg-card border border-(--border) flex items-center gap-2 rounded-xl rounded-tl-sm px-3.5 py-2.5">
              <Loader2 size={14} className="text-primary animate-spin" />
              <span className="text-muted-foreground text-sm">Pensando...</span>
            </div>
          </div>
        )}

        {/* Erro */}
        {error && (
          <p className="text-center text-xs text-red-500">{error}</p>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sugestões (apenas quando não há mensagens) */}
      {messages.length === 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => void handleSubmit(q)}
              className="bg-(--border)/40 text-muted-foreground hover:bg-muted-primary hover:text-primary cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border border-(--border) bg-input flex items-center gap-2 rounded-xl px-3 py-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte sobre suas finanças..."
          rows={1}
          className="text-foreground placeholder:text-muted-foreground flex-1 resize-none bg-transparent text-sm outline-none"
          style={{ maxHeight: '96px' }}
        />
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!input.trim() || isLoading}
          className="bg-primary flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowUp size={16} className="text-primary-foreground" />
        </button>
      </div>
    </div>
  )
}
