// Chat related types
export interface ChatSession {
  id: string
  title: string
  analyticsTypeName: string
  startTime: string
  lastMessageAt: string | null
  messageCount: number
}

export interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface ApiChatMessage {
  id: string
  questionText: string
  responseText: string
  createdAt: string
}

export interface CreateChatSessionRequest {
  analyticsTypeId: string
  title: string
}

export interface CreateChatSessionResponse {
  sessionId: string
  message: string
}

export interface AskQuestionRequest {
  sessionId: string
  questionText: string
}

export interface AskQuestionResponse {
  promptId: string
  responseText: string
  citations: unknown[]
  retrievalCount: number
}

export interface GetChatHistoryResponse {
  sessionId: string
  messages: ApiChatMessage[]
}

export interface GetChatSessionsResponse {
  sessions: ChatSession[]
}

// Chat state interface
export interface ChatState {
  currentSession: ChatSession | null
  sessions: ChatSession[]
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
}
