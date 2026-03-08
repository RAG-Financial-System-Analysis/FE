import axiosInstance from '@/lib/axios'

export interface ChatSession {
  Id: string
  Title: string
  AnalyticsTypeName: string
  StartTime: string
  LastMessageAt: string
  MessageCount: number
}

export interface ChatMessage {
  Id: string
  QuestionText: string
  ResponseText: string
  CreatedAt: string
  Citations?: Citation[]
}

export interface Citation {
  ReportId: string
  Source: string
}

export interface AnalyticType {
  Id: string
  Code: string
  Name: string
  Description: string
}

class ChatService {
  async getAnalyticTypes() {
    const response = await axiosInstance.get('/analytics/types')
    return response.data
  }

  async getMySessions() {
    const response = await axiosInstance.get('/chat/sessions')
    return response.data
  }

  async createSession(analyticsTypeId: string, title: string) {
    const response = await axiosInstance.post('/chat/sessions', {
      AnalyticsTypeId: analyticsTypeId,
      Title: title
    })
    return response.data
  }

  async askQuestion(sessionId: string, questionText: string) {
    const response = await axiosInstance.post('/chat/ask', {
      SessionId: sessionId,
      QuestionText: questionText
    })
    return response.data
  }

  async getChatHistory(sessionId: string) {
    const response = await axiosInstance.get(`/chat/sessions/${sessionId}/messages`)
    return response.data
  }
}

export default new ChatService()
