import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import Sidebar from '../../Components/Sidebar';
import '../../Pages_css/Chat.css';

const MessageBubble = ({ role, text, isLoading }) => {
    return (
        <div className={`sensei-message-row ${role}`}>
            {role === 'sensei' && <div className="sensei-avatar">🥋</div>}
            <div className={`sensei-message-bubble ${role}`}>
                {isLoading ? (
                    <span className="sensei-typing-dots">
                        <span className="sensei-dot"></span>
                        <span className="sensei-dot"></span>
                        <span className="sensei-dot"></span>
                    </span>
                ) : (
                    text
                )}
            </div>
        </div>
    );
};

const ActionIndicator = ({ action }) => {
    if (!action) return null;
    return (
        <div className="sensei-action-row">
            <div className="sensei-action-bubble">
                <span className="sensei-action-icon">⚙️</span> {action}
            </div>
        </div>
    );
};

const Sensei = ({ userEmail = localStorage.getItem('email') }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'sensei', text: "Hello! I am your AI Sensei. Ask me about your stats, rank, or any DSA concepts." }
    ]);
    const [actionStatus, setActionStatus] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, actionStatus]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMessage = input;
        setInput('');
        setIsTyping(true);
        setActionStatus('');

        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setMessages(prev => [...prev, { role: 'sensei', text: '' }]);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/home/Sensei`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, message: userMessage })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        let data = line.replace('data: ', '');

                        if (data === '[DONE]') {
                            setIsTyping(false);
                            setActionStatus('');
                            break;
                        }
                        else if (data.startsWith('[ERROR]')) {
                            setMessages(prev => {
                                const newHistory = [...prev];
                                newHistory[newHistory.length - 1].text += "\n\n❌ " + data.replace('[ERROR]', '');
                                return newHistory;
                            });
                            setIsTyping(false);
                        }
                        else if (data.startsWith('[ACTION]')) {
                            setActionStatus(data.replace('[ACTION] ', ''));
                        }
                        else {
                            setActionStatus('');
                            data = data.replace(/<think>.*?<\/think>/gs, '');
                            const textChunk = data.replace(/<br>/g, '\n');

                            setMessages(prev => {
                                const newHistory = [...prev];
                                newHistory[newHistory.length - 1].text += textChunk;
                                return newHistory;
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1].text = "Connection lost. Sensei is currently meditating.";
                return newHistory;
            });
            setIsTyping(false);
            setActionStatus('');
        }
    };

    return (
        <div className="sensei-page-unique">
            <Navbar />

            <div className="main-layout">
                <Sidebar />

                <div className="content-area">
                    <div className="sensei-chat-wrapper">
                        <div className="sensei-chat-header">
                            <h6 className="section-title">Welcome To DSA Sensei's DOJO: ask anything</h6>
                            <span className={`sensei-status-pill ${isTyping ? 'busy' : 'ready'}`}>
                                <span className="sensei-status-dot"></span>
                                {isTyping ? 'Meditating...' : 'Ready'}
                            </span>
                        </div>

                        <div className="sensei-chat-card">
                            <div className="sensei-messages-area">
                                {messages.map((msg, idx) => (
                                    <MessageBubble
                                        key={idx}
                                        role={msg.role}
                                        text={msg.text}
                                        isLoading={
                                            idx === messages.length - 1 &&
                                            msg.role === 'sensei' &&
                                            msg.text === '' &&
                                            isTyping &&
                                            !actionStatus
                                        }
                                    />
                                ))}

                                <ActionIndicator action={actionStatus} />
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="sensei-input-area">
                                <form onSubmit={handleSend} className="sensei-chat-form">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask Sensei about your stats, rank, or any DSA concept..."
                                        disabled={isTyping}
                                        className="sensei-chat-input"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isTyping || !input.trim()}
                                        className="sensei-submit-btn"
                                    >
                                        Send
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sensei;