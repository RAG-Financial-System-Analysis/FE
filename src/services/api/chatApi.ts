import axiosInstance from '@/lib/axios'
import type {
  CreateChatSessionRequest,
  CreateChatSessionResponse,
  AskQuestionRequest,
  AskQuestionResponse,
  GetChatHistoryResponse,
  GetChatSessionsResponse
} from '@/types/chat.types'

/**
 * Chat API module - Pure API communication with no business logic
 */
export const chatApi = {
  createSession: (data: CreateChatSessionRequest) =>
    axiosInstance.post<CreateChatSessionResponse>('/api/chat/sessions', data),

  askQuestion: (data: AskQuestionRequest) => axiosInstance.post<AskQuestionResponse>('/api/chat/ask', data),

  askQuestionAsync: (data: AskQuestionRequest) =>
    axiosInstance.post<{ jobId: string; status: string; message: string }>('/api/chat/ask-async', data),

  getChatHistory: (sessionId: string) =>
    axiosInstance.get<GetChatHistoryResponse>(`/api/chat/sessions/${sessionId}/messages`),

  getChatSessions: () => axiosInstance.get<GetChatSessionsResponse>('/api/chat/sessions')
}
