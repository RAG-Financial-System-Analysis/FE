import { useState, useCallback } from 'react'
import chatService from '@/services/chatService'
import type {
  ChatSession,
  ChatMessage,
  ApiChatMessage,
  CreateChatSessionRequest,
  AskQuestionRequest
} from '@/types/chat.types'

interface UseChatReturn {
  // State
  sessions: ChatSession[]
  currentSession: ChatSession | null
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  loadingAnswers: Set<string>

  // Actions
  createSession: (data: CreateChatSessionRequest) => Promise<{ success: boolean; message: string; sessionId?: string }>
  askQuestion: (data: AskQuestionRequest) => Promise<{ success: boolean; message: string; response?: unknown }>
  askQuestionAsync: (data: AskQuestionRequest) => Promise<{ success: boolean; message: string; response?: unknown }>
  loadSessions: () => Promise<{ success: boolean; message: string }>
  loadChatHistory: (sessionId: string) => Promise<{ success: boolean; message: string }>
  loadAnswerForQuestion: (questionId: string, questionText: string, sessionId: string) => Promise<void>
  setCurrentSession: (session: ChatSession | null) => void
  clearError: () => void
  setError: (message: string) => void
}

export const useChat = (): UseChatReturn => {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingAnswers, setLoadingAnswers] = useState<Set<string>>(new Set())

  const clearError = useCallback(() => setError(null), [])
  const setErrorMessage = useCallback((message: string) => setError(message), [])

  const createSession = useCallback(async (data: CreateChatSessionRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await chatService.createSession(data)

      return {
        success: true,
        message: response.message,
        sessionId: response.sessionId
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to create chat session'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Ask question using synchronous API (no background job needed)
  const askQuestionAsync = useCallback(async (data: AskQuestionRequest) => {
    setIsLoading(true)
    setError(null)

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      type: 'user',
      content: data.questionText,
      createdAt: new Date().toISOString()
    }

    // Add "AI đang phân tích..." message immediately
    const processingMessage: ChatMessage = {
      id: `temp-processing-${Date.now()}`,
      type: 'assistant',
      content: 'AI đang phân tích câu hỏi của bạn...',
      createdAt: new Date().toISOString(),
      isProcessing: true // Flag to identify processing message
    }

    setMessages((prev) => [...prev, userMessage, processingMessage])

    try {
      // Call synchronous API directly
      const response = await chatService.askQuestion(data)

      // Replace processing message with actual AI response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === processingMessage.id
            ? {
                id: response.promptId || `ai-${Date.now()}`,
                type: 'assistant' as const,
                content: response.responseText,
                createdAt: new Date().toISOString()
              }
            : msg
        )
      )

      setIsLoading(false)

      return {
        success: true,
        message: 'Question answered successfully',
        response: response
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        'Failed to ask question'

      // Replace processing message with error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === processingMessage.id
            ? {
                ...msg,
                content: 'Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi của bạn.',
                isProcessing: false
              }
            : msg
        )
      )

      setError(errorMessage)
      setIsLoading(false)
      return {
        success: false,
        message: errorMessage
      }
    }
  }, [])

  // Legacy ask method (synchronous) - STILL AVAILABLE
  const askQuestion = useCallback(async (data: AskQuestionRequest) => {
    setIsLoading(true)
    setError(null)

    try {
      // Add user message immediately
      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        type: 'user',
        content: data.questionText,
        createdAt: new Date().toISOString()
      }
      setMessages((prev) => [...prev, userMessage])

      const response = await chatService.askQuestion(data)

      // Add AI response
      const aiMessage: ChatMessage = {
        id: response.promptId || `ai-${Date.now()}`,
        type: 'assistant',
        content: response.responseText,
        createdAt: new Date().toISOString()
      }
      setMessages((prev) => [...prev, aiMessage])

      return {
        success: true,
        message: 'Question answered successfully',
        response: response
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to ask question'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadSessions = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await chatService.getChatSessions()
      setSessions(response.sessions)

      return {
        success: true,
        message: `Loaded ${response.sessions.length} chat sessions successfully`
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load chat sessions'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadChatHistory = useCallback(async (sessionId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await chatService.getChatHistory(sessionId)

      // Transform messages to match expected format
      const transformedMessages: ChatMessage[] = []
      response.messages.forEach((msg: ApiChatMessage) => {
        // Add user question
        transformedMessages.push({
          id: `${msg.id}-question`,
          type: 'user',
          content: msg.questionText,
          createdAt: msg.createdAt
        })

        // Add AI response if exists
        if (msg.responseText) {
          transformedMessages.push({
            id: msg.id,
            type: 'assistant',
            content: msg.responseText,
            createdAt: msg.createdAt
          })
        }
      })

      setMessages(transformedMessages)

      return {
        success: true,
        message: `Loaded ${transformedMessages.length} messages successfully`
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to load chat history'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadAnswerForQuestion = useCallback(
    async (questionId: string, questionText: string, sessionId: string) => {
      setLoadingAnswers((prev) => new Set(prev).add(questionId))

      try {
        // Use synchronous processing for loading answers
        const result = await askQuestionAsync({
          sessionId,
          questionText
        })

        if (result.success) {
          console.log('Answer loaded successfully')
        } else {
          setError(result.message)
        }
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load answer'
        setError(errorMessage)
      } finally {
        setLoadingAnswers((prev) => {
          const newSet = new Set(prev)
          newSet.delete(questionId)
          return newSet
        })
      }
    },
    [askQuestionAsync]
  )

  return {
    // State
    sessions,
    currentSession,
    messages,
    isLoading,
    error,
    loadingAnswers,

    // Actions
    createSession,
    askQuestion,
    askQuestionAsync,
    loadSessions,
    loadChatHistory,
    loadAnswerForQuestion,
    setCurrentSession,
    clearError,
    setError: setErrorMessage
  }
}
