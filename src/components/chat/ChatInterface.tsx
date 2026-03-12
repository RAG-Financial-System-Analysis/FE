import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChat } from '@/hooks/useChat'
import { CreateSessionModal } from './CreateSessionModal'
import type { ChatSession } from '@/types/chat.types'

export const ChatInterface: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [questionText, setQuestionText] = useState('')
  const [isAsking, setIsAsking] = useState(false)
  const [searchText, setSearchText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    currentSession,
    sessions,
    messages,
    isLoading,
    error,
    loadingAnswers,
    askQuestion,
    loadChatHistory,
    loadAnswerForQuestion,
    loadSessions,
    setCurrentSession,
    clearError
  } = useChat()

  // Load sessions on component mount
  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSessionSelect = async (session: ChatSession) => {
    setCurrentSession(session)
    await loadChatHistory(session.id)
  }

  const handleSessionCreated = async (sessionId: string) => {
    // Reload sessions and select the new one
    await loadSessions()
    const newSession = sessions.find((s) => s.id === sessionId)
    if (newSession) {
      setCurrentSession(newSession)
      await loadChatHistory(sessionId)
    }
  }
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentSession || !questionText.trim()) return

    setIsAsking(true)

    try {
      await askQuestion({
        sessionId: currentSession.id,
        questionText: questionText.trim()
      })
      setQuestionText('')
    } catch (error) {
      // Error handled by useChat hook
      console.error('Error asking question:', error)
    } finally {
      setIsAsking(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter sessions based on search text
  const filteredSessions = sessions.filter((session) => {
    if (!searchText.trim()) return true

    const searchLower = searchText.toLowerCase().trim()
    const titleMatch = session.title.toLowerCase().includes(searchLower)
    const analyticsTypeMatch = session.analyticsTypeName.toLowerCase().includes(searchLower)

    return titleMatch || analyticsTypeMatch
  })

  return (
    <div className='flex h-full bg-gradient-to-br from-slate-50 to-blue-50'>
      {/* Sidebar - Sessions List */}
      <div className='w-80 bg-white/80 backdrop-blur-sm border-r border-slate-200/60 flex flex-col shadow-lg'>
        {/* Header */}
        <div className='p-6 border-b border-slate-200/60 bg-gradient-to-r from-blue-600 to-indigo-600'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center'>
                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                  />
                </svg>
              </div>
              <h2 className='text-lg font-semibold text-white'>Phiên Chat</h2>
            </div>
            <Button
              size='sm'
              onClick={() => {
                setIsCreateModalOpen(true)
              }}
              className='bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-200 flex items-center gap-2'
              variant='outline'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
              </svg>
              Tạo mới
            </Button>
          </div>

          {/* Search Box */}
          <div className='relative'>
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder='Tìm kiếm theo tên chat hoặc loại phân tích...'
              className='w-full h-10 pl-10 pr-4 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 focus:border-white/50 rounded-lg backdrop-blur-sm'
            />
            <svg
              className='w-4 h-4 text-white/70 absolute left-3 top-1/2 transform -translate-y-1/2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
            {searchText && (
              <button
                onClick={() => setSearchText('')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            )}
          </div>
        </div>
        {/* Sessions List */}
        <div className='flex-1 overflow-y-auto'>
          {isLoading && sessions.length === 0 ? (
            <div className='p-4'>
              <div className='animate-pulse space-y-3'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='h-16 bg-gradient-to-r from-slate-200 to-slate-100 rounded-xl'></div>
                ))}
              </div>
            </div>
          ) : sessions.length === 0 ? (
            <div className='p-6 text-center'>
              <div className='text-slate-400 mb-6'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center'>
                  <svg className='w-8 h-8 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                    />
                  </svg>
                </div>
                <p className='text-sm font-medium text-slate-600 mb-2'>Chưa có phiên chat nào</p>
                <p className='text-xs text-slate-500'>Tạo phiên chat đầu tiên để bắt đầu</p>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setIsCreateModalOpen(true)
                }}
                className='bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200'
              >
                <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                </svg>
                Tạo phiên chat đầu tiên
              </Button>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className='p-6 text-center'>
              <div className='text-slate-400 mb-6'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center'>
                  <svg className='w-8 h-8 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                </div>
                <p className='text-sm font-medium text-slate-600 mb-2'>Không tìm thấy phiên chat nào</p>
                <p className='text-xs text-slate-500'>Thử tìm kiếm với từ khóa khác</p>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setSearchText('')}
                className='bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 text-slate-700 hover:from-slate-100 hover:to-gray-100 transition-all duration-200'
              >
                <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <div className='p-3'>
              {/* Search Results Info */}
              {searchText && (
                <div className='px-3 py-2 mb-3 text-xs text-slate-600 bg-blue-50 rounded-lg border border-blue-200'>
                  <div className='flex items-center gap-2'>
                    <svg className='w-4 h-4 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    <span>
                      Tìm thấy <strong>{filteredSessions.length}</strong> phiên chat cho "{searchText}"
                    </span>
                  </div>
                </div>
              )}

              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className={`
                    p-4 rounded-xl cursor-pointer transition-all duration-200 mb-3 group
                    ${
                      currentSession?.id === session.id
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md transform scale-[1.02]'
                        : 'hover:bg-slate-50 border-2 border-transparent hover:border-slate-200 hover:shadow-sm'
                    }
                  `}
                  onClick={() => handleSessionSelect(session)}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 min-w-0'>
                      <h3
                        className={`font-medium text-sm mb-1 line-clamp-2 ${
                          currentSession?.id === session.id ? 'text-blue-900' : 'text-slate-900'
                        }`}
                      >
                        {session.title}
                      </h3>
                      <p
                        className={`text-xs mb-2 ${
                          currentSession?.id === session.id ? 'text-blue-700' : 'text-slate-600'
                        }`}
                      >
                        {session.analyticsTypeName}
                      </p>
                      <div className='flex items-center justify-between text-xs'>
                        <div className='flex items-center gap-3'>
                          <span
                            className={`flex items-center gap-1 ${
                              currentSession?.id === session.id ? 'text-blue-600' : 'text-slate-500'
                            }`}
                          >
                            <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                              />
                            </svg>
                            {session.messageCount}
                          </span>
                          <span
                            className={`flex items-center gap-1 ${
                              currentSession?.id === session.id ? 'text-blue-600' : 'text-slate-500'
                            }`}
                          >
                            <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2z'
                              />
                            </svg>
                            {new Date(session.startTime).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>
                    {currentSession?.id === session.id && (
                      <div className='ml-3 flex-shrink-0'>
                        <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col bg-white/50 backdrop-blur-sm'>
        {currentSession ? (
          <>
            {/* Chat Header */}
            <div className='p-6 bg-white/80 backdrop-blur-sm border-b border-slate-200/60 shadow-sm'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg'>
                  <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-slate-900 text-lg'>{currentSession.title}</h3>
                  <p className='text-sm text-slate-500 flex items-center gap-2'>
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                      />
                    </svg>
                    {currentSession.analyticsTypeName}
                  </p>
                  <p className='text-xs text-slate-400 flex items-center gap-2 mt-1'>
                    <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    Tạo lúc {new Date(currentSession.startTime).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
            {/* Messages Area */}
            <div className='flex-1 overflow-y-auto p-6 space-y-6'>
              {/* Loading Progress Indicator - Only show when initially loading questions */}
              {isLoading && messages.length === 0 && (
                <div className='text-center py-16'>
                  <div className='text-slate-400 mb-8'>
                    <div className='w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-inner'>
                      <div className='w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin'></div>
                    </div>
                    <h3 className='text-xl font-semibold text-slate-700 mb-2'>Đang tải lịch sử chat...</h3>
                    <p className='text-slate-500 max-w-md mx-auto'>Đang tải các câu hỏi từ phiên chat này</p>
                  </div>
                </div>
              )}

              {!isLoading && messages.length === 0 && !isAsking && (
                <div className='text-center py-16'>
                  <div className='text-slate-400 mb-8'>
                    <div className='w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-inner'>
                      <svg className='w-10 h-10 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1.5}
                          d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                        />
                      </svg>
                    </div>
                    <h3 className='text-xl font-semibold text-slate-700 mb-2'>Bắt đầu cuộc trò chuyện</h3>
                    <p className='text-slate-500 max-w-md mx-auto'>
                      Đặt câu hỏi về báo cáo tài chính và nhận được phân tích chi tiết từ AI
                    </p>
                  </div>
                </div>
              )}
              {/* Messages */}
              {messages.map((message, index) => {
                // Check if this is a user message and if there's an answer after it
                const isUserMessage = message.type === 'user'
                const nextMessage = messages[index + 1]
                const hasAnswer = nextMessage && nextMessage.type === 'assistant'
                const isLoadingAnswer = loadingAnswers.has(message.id)

                // Check if this is the latest user message and we're currently asking a question
                const isLatestUserMessage = isUserMessage && index === messages.length - 1
                const shouldShowLoadButton =
                  isUserMessage && !hasAnswer && !isLoadingAnswer && !(isLatestUserMessage && isAsking)

                return (
                  <div key={message.id}>
                    {/* Message */}
                    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`flex items-start gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                            message.type === 'user'
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                              : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                          }`}
                        >
                          {message.type === 'user' ? (
                            <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                              />
                            </svg>
                          ) : (
                            <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                              />
                            </svg>
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`rounded-2xl px-4 py-3 shadow-sm ${
                            message.type === 'user'
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                              : 'bg-white border border-slate-200 text-slate-800'
                          }`}
                        >
                          <p className='text-sm whitespace-pre-wrap leading-relaxed'>{message.content}</p>
                          <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                            {formatTimestamp(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Load Answer Button or Loading State (only for user messages without answers) */}
                    {shouldShowLoadButton && (
                      <div className='flex justify-start mt-4'>
                        <div className='flex items-start gap-3 max-w-[80%]'>
                          {/* AI Avatar */}
                          <div className='w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md bg-gradient-to-br from-emerald-500 to-teal-600'>
                            {isLoadingAnswer ? (
                              <div className='w-4 h-4 border border-white border-t-transparent rounded-full animate-spin'></div>
                            ) : (
                              <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth={2}
                                  d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                                />
                              </svg>
                            )}
                          </div>

                          {/* Load Answer Button or Loading State */}
                          {isLoadingAnswer ? (
                            <div className='bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl px-4 py-3 shadow-sm'>
                              <div className='flex items-center gap-3'>
                                <div className='flex gap-1'>
                                  <div className='w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                                  <div className='w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                                  <div className='w-2 h-2 bg-emerald-500 rounded-full animate-bounce'></div>
                                </div>
                                <span className='text-sm text-emerald-700 font-medium'>AI đang tạo câu trả lời...</span>
                              </div>
                            </div>
                          ) : (
                            <div className='bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-2xl px-4 py-3 shadow-sm'>
                              <div className='flex items-center gap-3'>
                                <Button
                                  size='sm'
                                  onClick={() => {
                                    if (currentSession) {
                                      loadAnswerForQuestion(message.id, message.content, currentSession.id)
                                    }
                                  }}
                                  className='bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs px-3 py-1 h-auto'
                                >
                                  <svg className='w-3 h-3 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                                    />
                                  </svg>
                                  Tải câu trả lời
                                </Button>
                                <span className='text-xs text-slate-600'>
                                  Bấm để AI tạo câu trả lời cho câu hỏi này
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              {/* Loading Message for new questions */}
              {isAsking && (
                <div className='flex justify-start'>
                  <div className='flex items-start gap-3 max-w-[80%]'>
                    {/* AI Avatar */}
                    <div className='w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md bg-gradient-to-br from-emerald-500 to-teal-600'>
                      <svg className='w-4 h-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                        />
                      </svg>
                    </div>

                    {/* Loading Bubble */}
                    <div className='bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm'>
                      <div className='flex items-center gap-2'>
                        <div className='flex gap-1'>
                          <div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                          <div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                          <div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce'></div>
                        </div>
                        <span className='text-sm text-slate-600 ml-2'>AI đang phân tích...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className='p-6 bg-white/80 backdrop-blur-sm border-t border-slate-200/60'>
              {error && (
                <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between shadow-sm'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center'>
                      <svg className='w-4 h-4 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                    </div>
                    <p className='text-sm text-red-700 font-medium'>{error}</p>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={clearError}
                    className='text-red-600 hover:text-red-700 hover:bg-red-100'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </Button>
                </div>
              )}
              <form onSubmit={handleAskQuestion} className='flex gap-3'>
                <div className='flex-1 relative'>
                  <Input
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder={isAsking ? 'Đang chờ phản hồi từ AI...' : 'Đặt câu hỏi về báo cáo tài chính...'}
                    disabled={isAsking}
                    className={`pr-12 h-12 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 ${
                      isAsking ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                    maxLength={1000}
                  />
                  <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-400'>
                    {isAsking ? (
                      <div className='flex items-center gap-1'>
                        <div className='w-3 h-3 border border-slate-400 border-t-transparent rounded-full animate-spin'></div>
                        <span>Đang gửi...</span>
                      </div>
                    ) : (
                      `${questionText.length}/1000`
                    )}
                  </div>
                </div>
                <Button
                  type='submit'
                  disabled={!questionText.trim() || isAsking}
                  className='h-12 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isAsking ? (
                    <div className='flex items-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                      <span className='text-sm'>Đang gửi</span>
                    </div>
                  ) : (
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                      />
                    </svg>
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          /* No Session Selected */
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center max-w-md'>
              <div className='text-slate-400 mb-8'>
                <div className='w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-inner'>
                  <svg className='w-12 h-12 text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                    />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-slate-700 mb-3'>Chọn phiên chat</h3>
                <p className='text-slate-500 mb-8 leading-relaxed'>
                  Chọn một phiên chat từ danh sách bên trái hoặc tạo phiên mới để bắt đầu cuộc trò chuyện với AI
                </p>
              </div>
              <Button
                onClick={() => {
                  setIsCreateModalOpen(true)
                }}
                className='bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base font-medium'
              >
                <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                </svg>
                Tạo phiên chat mới
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      <CreateSessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSessionCreated={handleSessionCreated}
      />
    </div>
  )
}
