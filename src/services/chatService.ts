import { chatApi } from './api'
import type {
  CreateChatSessionRequest,
  CreateChatSessionResponse,
  AskQuestionRequest,
  AskQuestionResponse,
  GetChatHistoryResponse,
  GetChatSessionsResponse
} from '@/types/chat.types'

/**
 * Chat Service - Business logic and data transformation
 *
 * Manages chat sessions and interactions with the RAG system.
 * Supports both synchronous and asynchronous question answering.
 *
 * @class ChatService
 * @example
 * ```typescript
 * import { chatService } from '@/services'
 *
 * // Create a new chat session
 * const session = await chatService.createSession({
 *   analyticsTypeId: 'type-123',
 *   title: 'Financial Analysis'
 * })
 *
 * // Ask a question asynchronously
 * const result = await chatService.askQuestionAsync({
 *   sessionId: session.sessionId,
 *   questionText: 'What is the revenue trend?'
 * })
 * ```
 */
class ChatService {
  /**
   * Create a new chat session
   *
   * @param {CreateChatSessionRequest} data - Session creation data
   * @param {string} data.analyticsTypeId - ID of the analytics type for this session
   * @param {string} data.title - Session title
   * @returns {Promise<CreateChatSessionResponse>} Created session with ID
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const response = await chatService.createSession({
   *   analyticsTypeId: 'financial-analysis',
   *   title: 'Q4 Financial Review'
   * })
   * console.log(response.sessionId) // Use this for subsequent questions
   * ```
   */
  async createSession(data: CreateChatSessionRequest): Promise<CreateChatSessionResponse> {
    const response = await chatApi.createSession(data)
    return response.data
  }

  /**
   * Ask a question in a chat session (Synchronous)
   *
   * ⚠️ **DEPRECATED** - Use askQuestionAsync instead for better performance
   *
   * This method waits for the full response, which may timeout on slow queries.
   *
   * @param {AskQuestionRequest} data - Question data
   * @param {string} data.sessionId - Chat session ID
   * @param {string} data.questionText - The question to ask
   * @returns {Promise<AskQuestionResponse>} Response with answer and citations
   * @throws {Error} If API request fails or times out
   *
   * @deprecated Use askQuestionAsync instead
   */
  async askQuestion(data: AskQuestionRequest): Promise<AskQuestionResponse> {
    const response = await chatApi.askQuestion(data)
    return response.data
  }

  /**
   * Ask a question in a chat session (Asynchronous)
   *
   * ✅ **RECOMMENDED** - Returns immediately with a job ID for polling
   *
   * Use this method for better performance. Poll the job status to get results.
   *
   * @param {AskQuestionRequest} data - Question data
   * @param {string} data.sessionId - Chat session ID
   * @param {string} data.questionText - The question to ask
   * @returns {Promise<{ jobId: string; status: string; message: string }>} Job ID for polling
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const result = await chatService.askQuestionAsync({
   *   sessionId: 'session-123',
   *   questionText: 'What are the key metrics?'
   * })
   *
   * // Poll for results using jobsService
   * const answer = await jobsService.pollJobStatus(result.jobId)
   * ```
   */
  async askQuestionAsync(data: AskQuestionRequest): Promise<{ jobId: string; status: string; message: string }> {
    const response = await chatApi.askQuestionAsync(data)
    return response.data
  }

  /**
   * Get chat history for a session
   *
   * Retrieves all messages in a chat session.
   *
   * @param {string} sessionId - The chat session ID
   * @returns {Promise<GetChatHistoryResponse>} Session messages
   * @throws {Error} If session not found or API request fails
   *
   * @example
   * ```typescript
   * const history = await chatService.getChatHistory('session-123')
   * console.log(history.messages) // Array of messages
   * ```
   */
  async getChatHistory(sessionId: string): Promise<GetChatHistoryResponse> {
    const response = await chatApi.getChatHistory(sessionId)
    return response.data
  }

  /**
   * Get all chat sessions for the current user
   *
   * @returns {Promise<GetChatSessionsResponse>} List of user's chat sessions
   * @throws {Error} If API request fails
   *
   * @example
   * ```typescript
   * const response = await chatService.getChatSessions()
   * console.log(response.sessions) // Array of sessions
   * ```
   */
  async getChatSessions(): Promise<GetChatSessionsResponse> {
    const response = await chatApi.getChatSessions()
    return response.data
  }
}

export const chatService = new ChatService()
