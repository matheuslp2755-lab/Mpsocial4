import React, { useState, useEffect, useRef } from 'react';
import { ChatConversation, User } from '../types';

interface ChatViewProps {
    conversation: ChatConversation;
    currentUser: User;
    onBack: () => void;
    onSendMessage: (conversationId: string, text: string) => void;
    t: (key: any) => string;
}

const EMOJIS = ['😀', '😂', '❤️', '👍', '🙏', '😭', '🔥', '🎉', '🤔', '😊', '💯', '✨'];

const ChatView: React.FC<ChatViewProps> = ({ conversation, currentUser, onBack, onSendMessage, t }) => {
    const [message, setMessage] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [conversation.messages]);

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(conversation.id, message);
            setMessage('');
            setShowEmojis(false);
        }
    };
    
    const handleEmojiClick = (emoji: string) => {
        setMessage(prev => prev + emoji);
    };

    return (
        <div className="h-full flex flex-col bg-nexus-dark">
            <header className="flex items-center p-3 border-b border-nexus-light-gray sticky top-0 bg-nexus-dark/80 backdrop-blur-lg z-10">
                <button onClick={onBack} className="mr-3">
                    <i className="fa-solid fa-chevron-left text-lg"></i>
                </button>
                <img src={conversation.user.avatarUrl} alt={conversation.user.name} className="w-9 h-9 rounded-full mr-3" />
                <h2 className="font-bold">{conversation.user.name}</h2>
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                {conversation.messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end mb-3 ${msg.isSender ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl ${msg.isSender ? 'bg-nexus-secondary text-white rounded-br-md' : 'bg-nexus-light-gray text-white rounded-bl-md'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className="text-xs text-gray-400 mt-1 text-right">{msg.timestamp}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>

            {showEmojis && (
                <div className="p-2 bg-nexus-gray border-t border-nexus-light-gray">
                    <div className="grid grid-cols-6 gap-2 text-center">
                        {EMOJIS.map(emoji => (
                            <button key={emoji} onClick={() => handleEmojiClick(emoji)} className="text-2xl p-1 rounded-lg hover:bg-nexus-light-gray">
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <footer className="p-2 border-t border-nexus-light-gray bg-nexus-dark">
                <div className="flex items-center bg-nexus-light-gray rounded-full px-2">
                    <button onClick={() => setShowEmojis(!showEmojis)} className="p-2 text-gray-400 hover:text-white">
                        <i className="fa-regular fa-face-smile text-xl"></i>
                    </button>
                    <input
                        type="text"
                        placeholder={t('message_placeholder')}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 bg-transparent px-3 py-2 focus:outline-none text-white"
                    />
                    <button onClick={handleSend} className="p-2 text-nexus-secondary font-semibold disabled:opacity-50" disabled={!message.trim()}>
                        {t('send_button')}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ChatView;
