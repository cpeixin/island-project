'use client';

import { useChat } from 'ai/react';
import { useRef, useEffect } from 'react';
import { Send, Anchor, Sparkles } from 'lucide-react'; // 图标

export default function IslandHome() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    // 全局背景：海盐蓝渐变，模拟清晨的海面
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-50 to-blue-50/50 text-slate-700 font-sans overflow-hidden">
      
      {/* 顶部导航 */}
      <header className="px-6 py-4 flex justify-between items-center bg-white/40 backdrop-blur-md border-b border-white/20 z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-md">
            <Anchor size={16} />
          </div>
          <h1 className="text-sm font-bold tracking-widest text-slate-800 uppercase">
            岛屿实验室 <span className="font-light text-slate-500">小马同学.</span>
          </h1>
        </div>
        <div className="text-[10px] bg-white/50 px-2 py-1 rounded-full text-slate-400 border border-slate-200">
          Beta 1.0
        </div>
      </header>

      {/* 聊天区域 */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-32">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-0 animate-fade-in-up" style={{animationFillMode: 'forwards'}}>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-50">
              <span className="text-4xl">🏝️</span>
            </div>
            <div className="max-w-xs space-y-2">
              <h2 className="text-lg font-medium text-slate-800">欢迎来到岛屿计划</h2>
              <p className="text-sm text-slate-500 font-light leading-relaxed">
                这里的海浪很轻。<br/>
                如果你有无法对别人说的心事，<br/>
                可以写在漂流瓶里告诉我。
              </p>
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 text-sm leading-7 shadow-sm ${
                m.role === 'user'
                  ? 'bg-slate-800 text-slate-50 rounded-tr-sm' // 用户消息：深色
                  : 'bg-white border border-blue-50 text-slate-700 shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-tl-sm' // AI 消息：白色卡片
              }`}
            >
              {m.role !== 'user' && (
                  <div className="flex items-center gap-2 mb-3">
                    {/* 图标换成了 Wind (风)，更符合逍遥的气质 */}
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100/50 text-blue-600">
                       {/* 如果 Wind 报错，请确保在顶部 import { Wind } from 'lucide-react'; */}
                       {/* 或者你可以继续用 Anchor 或 Sparkles */}
                       <Anchor size={14} /> 
                    </div>
                    
                    <span className="text-xs font-bold text-slate-600 tracking-wider">
                      逍遥 · 守岛人
                    </span>
                  </div>
                )}
              <div className="whitespace-pre-wrap font-light tracking-wide">
                {m.content}
              </div>
            </div>
          </div>
        ))}
        
        {/* 加载动画 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-blue-50 flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* 底部输入栏 */}
      <footer className="fixed bottom-0 w-full p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto shadow-2xl shadow-blue-900/5 rounded-full">
          <input
            className="w-full bg-white border border-slate-200 rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 placeholder-slate-400 transition-all text-slate-700"
            value={input}
            placeholder="写下你的心事..."
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-slate-800 hover:bg-slate-700 disabled:bg-slate-200 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all text-white shadow-lg"
          >
            {isLoading ? (
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={16} className="ml-0.5" />
            )}
          </button>
        </form>
      </footer>
    </div>
  );
}