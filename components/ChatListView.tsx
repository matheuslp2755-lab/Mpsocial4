import React from 'react';
import { ChatConversation } from '../types';

interface ChatListViewProps {
    conversations: ChatConversation[];
    onSelectConversation: (conversation: ChatConversation) => void;
    t: (key: any) => string;
}

const ChatListHeader: React.FC<{ t: (key: any) => string }> = ({ t }) => (
    <header className="p-4 sticky top-0 bg-nexus-dark/80 backdrop-blur-lg z-10 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('chats_title')}</h1>
        <button aria-label={t('new_chat_button_label')}>
            <i className="fa-regular fa-pen-to-square text-xl"></i>
        </button>
    </header>
);

const ChatListItem: React.FC<{ conversation: ChatConversation; onClick: () => void }> = ({ conversation, onClick }) => (
    <div onClick={onClick} className="flex items-center p-3 hover:bg-nexus-light-gray rounded-lg cursor-pointer">
        <img src={conversation.user.avatarUrl} alt={conversation.user.name} className="w-14 h-14 rounded-full mr-4" />
        <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-start">
                <h3 className="font-semibold">{conversation.user.name}</h3>
                <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{conversation.lastMessageTime}</span>
            </div>
            <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
        </div>
    </div>
);


const ChatListView: React.FC<ChatListViewProps> = ({ conversations, onSelectConversation, t }) => {
  return (
    <div>
        <ChatListHeader t={t} />
        <div className="p-2">
             <div className="relative mb-2">
                <input
                    type="text"
                    placeholder={t('search_chats_placeholder')}
                    className="w-full bg-nexus-light-gray rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-nexus-secondary"
                />
                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            <div>
                {conversations.length > 0 ? (
                    conversations.map(convo => (
                        <ChatListItem key={convo.id} conversation={convo} onClick={() => onSelectConversation(convo)} />
                    ))
                ) : (
                    <div className="text-center p-16 text-gray-400">
                        <i className="fa-regular fa-paper-plane text-5xl mb-4"></i>
                        <h2 className="text-xl font-bold">{t('chat_empty_title')}</h2>
                        <p>{t('chat_empty_subtitle')}</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ChatListView;