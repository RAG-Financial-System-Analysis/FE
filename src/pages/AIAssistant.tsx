import { useState, useEffect, useRef } from 'react'
import { Send, Bot, Loader2, Sparkles, MessageSquare } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import chatService, { type ChatMessage, type AnalyticType } from '@/services/chatService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const AIAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [analyticTypes, setAnalyticTypes] = useState<AnalyticType[]>([])
  const [selectedTypeId, setSelectedTypeId] = useState<string>('')
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await chatService.getAnalyticTypes()
        // Handle case where analytic Types come back in camelCase vs PascalCase
        const typeList = types.AnalyticTypes || types.analyticTypes || []
        setAnalyticTypes(typeList)
        if (typeList.length > 0) {
          setSelectedTypeId(typeList[0].Id || typeList[0].id)
        }
      } catch (err) {
        console.error('Failed to fetch analytic types:', err)
      }
    }
    fetchTypes()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      Id: Date.now().toString(),
      QuestionText: inputValue,
      ResponseText: '',
      CreatedAt: new Date().toISOString()
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      let sessionId = currentSessionId
      if (!sessionId) {
        const session = await chatService.createSession(selectedTypeId, `Chat ${new Date().toLocaleTimeString()}`)
        // Map both cases for session ID
        sessionId = session.SessionId || session.sessionId
        setCurrentSessionId(sessionId)
      }

      const response = await chatService.askQuestion(sessionId!, inputValue)

      setMessages((prev) => {
        const updated = [...prev]
        const lastMsg = updated[updated.length - 1]
        // Map fields based on API response
        lastMsg.ResponseText = response.ResponseText || response.responseText
        lastMsg.Citations = response.Citations || response.citations
        return [...updated]
      })
    } catch (err) {
      console.error('Failed to ask question:', err)
      setMessages((prev) => [
        ...prev,
        {
          Id: 'error',
          QuestionText: '',
          ResponseText: 'Sorry, I encountered an error processing your request.',
          CreatedAt: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen bg-gray-50/50 font-outfit'>
      <Sidebar />
      <main className='flex-1 ml-64 flex flex-col h-screen'>
        {/* Header */}
        <header className='p-6 border-b border-gray-100 bg-white flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center'>
              <MessageSquare size={24} />
            </div>
            <div>
              <h2 className='text-xl font-bold text-gray-900'>AI Financial Assistant</h2>
              <p className='text-xs text-gray-400'>Powered by RAG & OpenAI</p>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <select
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(e.target.value)}
              className='bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5'
            >
              {analyticTypes.map((type) => (
                <option key={type.Id || (type as any).id} value={type.Id || (type as any).id}>
                  {type.Name || (type as any).name}
                </option>
              ))}
            </select>
            <Button
              variant='outline'
              onClick={() => {
                setMessages([])
                setCurrentSessionId(null)
              }}
            >
              New Chat
            </Button>
          </div>
        </header>

        {/* Chat Messages */}
        <div className='flex-1 overflow-y-auto p-6 space-y-6'>
          {messages.length === 0 && (
            <div className='flex flex-col items-center justify-center h-full text-center'>
              <div className='w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6'>
                <Sparkles size={32} />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>How can I help you today?</h3>
              <p className='text-gray-500 max-w-sm'>
                Ask me questions about uploaded financial reports, ratio analysis, or stock trends.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.Id} className='space-y-4'>
              {/* User Message */}
              <div className='flex justify-end'>
                <div className='bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-md'>
                  <p className='text-sm'>{msg.QuestionText}</p>
                </div>
              </div>

              {/* Bot Message */}
              <div className='flex justify-start gap-4'>
                <div className='w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center shadow-sm shrink-0'>
                  <Bot size={18} className='text-blue-600' />
                </div>
                <div className='bg-white p-4 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm border border-gray-100'>
                  {msg.ResponseText ? (
                    <div className='space-y-3'>
                      <p className='text-sm text-gray-800 leading-relaxed'>{msg.ResponseText}</p>
                      {msg.Citations && msg.Citations.length > 0 && (
                        <div className='pt-3 border-t border-gray-50'>
                          <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2'>Sources</p>
                          <div className='flex flex-wrap gap-2'>
                            {msg.Citations.map((cite, i) => (
                              <span
                                key={i}
                                className='px-2 py-1 bg-gray-50 text-gray-500 text-[10px] rounded-md border border-gray-100'
                              >
                                {cite.Source || (cite as any).source}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='flex items-center gap-2 text-gray-400'>
                      <Loader2 size={16} className='animate-spin' />
                      <span className='text-xs italic'>AI is thinking...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className='p-6 bg-white border-t border-gray-100'>
          <div className='max-w-4xl mx-auto flex gap-4'>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder='Type your question here...'
              className='flex-1 h-12 bg-gray-50 border-gray-100 rounded-xl focus:ring-blue-500'
              disabled={loading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading || !inputValue.trim()}
              className='h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white'
            >
              <Send size={20} />
            </Button>
          </div>
          <p className='text-[10px] text-gray-400 text-center mt-4'>
            AI can make mistakes. Verify important information against actual reports.
          </p>
        </div>
      </main>
    </div>
  )
}

export default AIAssistant
