import React, { useState, useEffect, useRef } from 'react';
import { Post, User, Comment } from '../types';

interface CommentsViewProps {
    post: Post;
    currentUser: User;
    onAddComment: (postId: string, text: string) => void;
    onBack: () => void;
    t: (key: any) => string;
}

const CommentsView: React.FC<CommentsViewProps> = ({ post, currentUser, onAddComment, onBack, t }) => {
    const [newComment, setNewComment] = useState('');
    const commentsEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [post.comments]);

    const handlePostComment = () => {
        if (newComment.trim()) {
            onAddComment(post.id, newComment);
            setNewComment('');
        }
    };

    return (
        <div className="h-full flex flex-col bg-nexus-dark">
            <header className="flex items-center p-3 border-b border-nexus-light-gray sticky top-0 bg-nexus-dark/80 backdrop-blur-lg z-10">
                <button onClick={onBack} className="mr-4">
                    <i className="fa-solid fa-chevron-left text-lg"></i>
                </button>
                <h2 className="font-bold text-xl">{t('comments_title')}</h2>
            </header>

            <main className="flex-1 overflow-y-auto p-4">
                {/* Original post caption */}
                <div className="flex items-start mb-4 pb-4 border-b border-nexus-light-gray">
                    <img src={post.user.avatarUrl} alt={post.user.name} className="w-9 h-9 rounded-full mr-3" />
                    <div>
                        <p className="text-sm">
                            <span className="font-semibold mr-2">{post.user.name}</span>
                            <span className="text-gray-200">{post.caption}</span>
                        </p>
                    </div>
                </div>

                {/* Comments list */}
                {post.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start mb-4">
                        <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-9 h-9 rounded-full mr-3" />
                        <div>
                            <p className="text-sm">
                                <span className="font-semibold mr-2">{comment.user.name}</span>
                                <span className="text-gray-200">{comment.text}</span>
                            </p>
                            {/* You can add a timestamp here later if needed */}
                        </div>
                    </div>
                ))}
                 <div ref={commentsEndRef} />
            </main>

            <footer className="p-2 border-t border-nexus-light-gray bg-nexus-dark">
                <div className="flex items-center">
                    <img src={currentUser.avatarUrl} alt="My Avatar" className="w-9 h-9 rounded-full mr-3" />
                    <input
                        type="text"
                        placeholder={t('add_comment_placeholder')}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
                        className="flex-1 bg-transparent focus:outline-none text-white placeholder-gray-400"
                    />
                    <button 
                        onClick={handlePostComment} 
                        className="font-semibold text-nexus-secondary disabled:opacity-50"
                        disabled={!newComment.trim()}
                    >
                        {t('post_comment_button')}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default CommentsView;