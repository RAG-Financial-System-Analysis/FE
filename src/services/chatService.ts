import axiosInstance from '@/lib/axios'
import type {
  CreateChatSessionRequest,
  CreateChatSessionResponse,
  AskQuestionRequest,
  AskQuestionResponse,
  GetChatHistoryResponse,
  GetChatSessionsResponse
} from '@/types/chat.types'

class ChatService {
  // Create new chat session
  async createSession(data: CreateChatSessionRequest): Promise<CreateChatSessionResponse> {
    const response = await axiosInstance.post('/api/chat/sessions', data)
    return response.data
  }

  // Ask question in chat session
  async askQuestion(data: AskQuestionRequest): Promise<AskQuestionResponse> {
    const response = await axiosInstance.post('/api/chat/ask', data)
    return response.data
  }

  // Get chat history for a session
  async getChatHistory(sessionId: string): Promise<GetChatHistoryResponse> {
    const response = await axiosInstance.get(`/api/chat/sessions/${sessionId}/messages`)
    return response.data
  }

  // Get all chat sessions for current user
  async getChatSessions(): Promise<GetChatSessionsResponse> {
    const response = await axiosInstance.get('/api/chat/sessions')
    return response.data
  }
}

export default new ChatService()
