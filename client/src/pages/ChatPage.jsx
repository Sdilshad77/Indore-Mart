import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, resetChat } from '../features/chat/chatSlice';
import { ShoppingBag, Send } from 'lucide-react';

export default function ChatPage() {

    const dispatch = useDispatch()

    const { chat, chatLoading, chatError, chatSuccess, chatErrorMessage } = useSelector(state => state.chat)

    const [messages, setMessages] = useState([
        {
            _id: 1,
            text: "Hello! I'm the IndoreMart Assistant. I can help you find products, locate shops, check prices, and answer questions about our services. What are you looking for today?",
            sender: 'ai',
            timestamp: new Date(),
        },
    ]);

    const handleChatHistory = (message) => {
        setMessages(prev => [...prev, message])
    }

    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
        if (chatSuccess) {
            handleChatHistory({
                _id: crypto.randomUUID(),
                text: chat.message,
                sender: 'ai',
                timestamp: new Date(),
            })
            dispatch(resetChat())
        }
    }, [chatSuccess]);

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!inputValue.trim()) return

        handleChatHistory({
            _id: crypto.randomUUID(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
        })

        dispatch(sendMessage(inputValue))
        setInputValue("")
        setTimeout(scrollToBottom, 100)
    };

    // ── design tokens (inline so Tailwind purge never affects them) ──
    const c = {
        pageBg:      '#070d09',
        headerBg:    '#0a1410',
        border:      'rgba(52,211,153,0.18)',
        borderSoft:  'rgba(52,211,153,0.1)',
        inputBg:     '#0d1813',
        emerald:     '#34d399',
        emeraldBg:   'rgba(52,211,153,0.12)',
        emeraldDark: '#059669',
        text:        '#e7f6ee',
        textMuted:   '#7fa593',
        textFaint:   '#4a6a5a',
        aiBubbleBg:  '#0f1c16',
        aiBubbleBorder: 'rgba(52,211,153,0.15)',
        userBubbleBg: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
        dotColor:    '#34d399',
    };

    const css = `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .chat-root {
            display: flex;
            flex-direction: column;
            height: 100vh;
            background: ${c.pageBg};
            font-family: 'DM Sans', sans-serif;
            position: relative;
        }

        /* ambient grid */
        .chat-grid {
            position: fixed;
            inset: 0;
            background-image:
                linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px);
            background-size: 44px 44px;
            mask-image: radial-gradient(ellipse 70% 50% at 50% 0%, black 20%, transparent 90%);
            -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 0%, black 20%, transparent 90%);
            pointer-events: none;
            z-index: 0;
        }

        /* scrollbar */
        .chat-messages::-webkit-scrollbar { width: 6px; }
        .chat-messages::-webkit-scrollbar-thumb {
            background: rgba(52,211,153,0.2);
            border-radius: 10px;
        }

        /* message bubble fade-in */
        @keyframes msgIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .msg-animate { animation: msgIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both; }

        /* dot typing */
        @keyframes dotBounce {
            0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
            40%          { transform: scale(1.2); opacity: 1; }
        }
        .dot1 { animation: dotBounce 1.3s ease-in-out infinite both 0s; }
        .dot2 { animation: dotBounce 1.3s ease-in-out infinite both 0.18s; }
        .dot3 { animation: dotBounce 1.3s ease-in-out infinite both 0.36s; }

        /* send button */
        .send-btn {
            background: linear-gradient(135deg, #34d399 0%, #059669 100%);
            color: #030f07;
            border: none;
            padding: 0 22px;
            height: 48px;
            border-radius: 14px;
            font-family: 'DM Sans', sans-serif;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 7px;
            flex-shrink: 0;
            transition: opacity 0.15s, transform 0.12s;
            box-shadow: 0 0 20px rgba(52,211,153,0.25);
        }
        .send-btn:hover { opacity: 0.9; }
        .send-btn:active { transform: scale(0.96); }
        .send-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* input */
        .chat-input {
            flex: 1;
            height: 48px;
            background: ${c.inputBg};
            border: 1px solid ${c.border};
            border-radius: 14px;
            padding: 0 16px;
            color: ${c.text};
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            outline: none;
            transition: border-color 0.15s;
        }
        .chat-input::placeholder { color: ${c.textFaint}; }
        .chat-input:focus { border-color: rgba(52,211,153,0.55); }

        @media(max-width:480px) {
            .send-btn { padding: 0 14px; }
            .send-btn .send-label { display: none; }
            .chat-header-text { font-size: 15px !important; }
        }
    `;

    return (
        <div className="chat-root">
            <style>{css}</style>
            <div className="chat-grid" />

            {/* ── HEADER ── */}
            <div style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 10,
                background: c.headerBg,
                borderBottom: `1px solid ${c.border}`,
                padding: '14px 20px',
                backdropFilter: 'blur(10px)',
            }}>
                <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '44px', height: '44px',
                        background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(52,211,153,0.35)',
                        flexShrink: 0,
                    }}>
                        <ShoppingBag style={{ width: '22px', height: '22px', color: '#030f07' }} />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: c.emerald, fontFamily: "'Syne', sans-serif" }}>
                            IndoreMart Assistant
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.emerald, boxShadow: `0 0 6px ${c.emerald}` }} />
                            <p style={{ margin: 0, fontSize: '12px', color: c.textMuted }}>Online · Your personal shopping guide</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MESSAGES ── */}
            <div
                className="chat-messages"
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '90px 20px 110px',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    {messages.map((message) => (
                        <div
                            key={message._id}
                            className="msg-animate"
                            style={{
                                display: 'flex',
                                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                            }}
                        >
                            {/* AI avatar dot */}
                            {message.sender === 'ai' && (
                                <div style={{
                                    width: '32px', height: '32px',
                                    background: c.emeraldBg,
                                    border: `1px solid ${c.border}`,
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                    marginRight: '10px',
                                    marginTop: '2px',
                                }}>
                                    <ShoppingBag style={{ width: '15px', height: '15px', color: c.emerald }} />
                                </div>
                            )}

                            <div style={{
                                maxWidth: '70%',
                                padding: '12px 16px',
                                borderRadius: message.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                background: message.sender === 'user'
                                    ? 'linear-gradient(135deg, #34d399 0%, #059669 100%)'
                                    : c.aiBubbleBg,
                                border: message.sender === 'user' ? 'none' : `1px solid ${c.aiBubbleBorder}`,
                                boxShadow: message.sender === 'user'
                                    ? '0 0 20px rgba(52,211,153,0.2)'
                                    : 'none',
                            }}>
                                <p style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    lineHeight: 1.6,
                                    color: message.sender === 'user' ? '#030f07' : c.text,
                                }}>
                                    {message.text}
                                </p>
                                <p style={{
                                    margin: 0,
                                    fontSize: '11px',
                                    marginTop: '6px',
                                    color: message.sender === 'user' ? 'rgba(3,15,7,0.55)' : c.textFaint,
                                }}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {chatLoading && (
                        <div className="msg-animate" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '32px', height: '32px',
                                background: c.emeraldBg,
                                border: `1px solid ${c.border}`,
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <ShoppingBag style={{ width: '15px', height: '15px', color: c.emerald }} />
                            </div>
                            <div style={{
                                padding: '14px 18px',
                                background: c.aiBubbleBg,
                                border: `1px solid ${c.aiBubbleBorder}`,
                                borderRadius: '18px 18px 18px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                            }}>
                                <div className="dot1" style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.emerald }} />
                                <div className="dot2" style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.emerald }} />
                                <div className="dot3" style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.emerald }} />
                            </div>
                        </div>
                    )}

                    {/* Error message */}
                    {chatError && (
                        <div className="msg-animate" style={{
                            padding: '10px 16px',
                            background: 'rgba(226,75,74,0.08)',
                            border: '1px solid rgba(226,75,74,0.25)',
                            borderRadius: '12px',
                            fontSize: '13px',
                            color: '#f09595',
                            textAlign: 'center',
                        }}>
                            ⚠️ {chatErrorMessage || 'Something went wrong. Please try again.'}
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* ── INPUT BAR ── */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                zIndex: 10,
                background: c.headerBg,
                borderTop: `1px solid ${c.border}`,
                padding: '14px 20px 18px',
                backdropFilter: 'blur(10px)',
            }}>
                <div style={{ maxWidth: '780px', margin: '0 auto' }}>
                    <form
                        onSubmit={handleSendMessage}
                        style={{ display: 'flex', gap: '10px' }}
                    >
                        <input
                            className="chat-input"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask me anything... e.g. 'Where can I find bread?'"
                            disabled={chatLoading}
                        />
                        <button
                            type="submit"
                            className="send-btn"
                            disabled={chatLoading || !inputValue.trim()}
                        >
                            <span className="send-label">Send</span>
                            <Send style={{ width: '15px', height: '15px' }} />
                        </button>
                    </form>
                    <p style={{ margin: '8px 0 0', fontSize: '12px', color: c.textFaint }}>
                        💡 Try asking about products, stores, delivery times, or prices
                    </p>
                </div>
            </div>
        </div>
    );
}