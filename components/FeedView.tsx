import React, { useState } from 'react';
import { Post, Story, User, View } from '../types';
import { mockStories } from '../data/mockData';
import StoryViewer from './StoryViewer';

interface FeedViewProps {
    posts: Post[];
    onViewProfile: (user: User) => void;
    onNavigate: (view: View) => void;
}

const FeedHeader: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => (
    <header className="p-4 flex justify-between items-center sticky top-0 bg-nexus-dark/80 backdrop-blur-lg z-10">
        <h1 className="text-3xl font-bold font-serif">MP SOCIAL</h1>
        <div className="flex items-center space-x-5">
            <button onClick={() => onNavigate(View.Create)} aria-label="Create Post"><i className="fa-regular fa-plus-square text-2xl"></i></button>
            <button aria-label="Notifications"><i className="fa-regular fa-heart text-2xl"></i></button>
            <button aria-label="Messages"><i className="fa-regular fa-paper-plane text-2xl"></i></button>
        </div>
    </header>
);

const StoryTray: React.FC<{ stories: Story[], onStoryClick: () => void }> = ({ stories, onStoryClick }) => (
    <div className="px-4 pt-2 pb-4 border-b border-nexus-light-gray">
        <div className="flex space-x-4 overflow-x-auto pb-2 -mb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {stories.map(story => (
                <div key={story.id} className="flex-shrink-0 text-center cursor-pointer" onClick={onStoryClick}>
                    <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600">
                        <img src={story.user.avatarUrl} alt={story.user.name} className="w-full h-full rounded-full border-2 border-nexus-dark object-cover" />
                    </div>
                    <p className="text-xs mt-1 truncate w-16">{story.user.name}</p>
                </div>
            ))}
        </div>
    </div>
);

const PostCard: React.FC<{ post: Post; onViewProfile: (user: User) => void; }> = ({ post, onViewProfile }) => (
    <div className="mb-4 border-b border-nexus-light-gray pb-2">
        <div className="flex items-center p-3">
            <div className="flex items-center cursor-pointer" onClick={() => onViewProfile(post.user)}>
                <img src={post.user.avatarUrl} alt={post.user.name} className="w-9 h-9 rounded-full mr-3" />
                <span className="font-semibold">{post.user.name}</span>
            </div>
            <button className="ml-auto text-gray-400"><i className="fa-solid fa-ellipsis"></i></button>
        </div>
        <div>
            {post.type === 'image' ? (
                <img src={post.contentUrl} alt="Post content" className="w-full" />
            ) : (
                <div className="relative">
                    <video src={post.contentUrl} className="w-full" loop playsInline muted />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white/50">
                        <i className="fa-solid fa-play text-4xl"></i>
                    </div>
                </div>
            )}
        </div>
        <div className="p-3">
            <div className="flex items-center space-x-4 mb-2">
                <button><i className="fa-regular fa-heart text-2xl"></i></button>
                <button><i className="fa-regular fa-comment text-2xl"></i></button>
                <button><i className="fa-regular fa-paper-plane text-2xl"></i></button>
                <button className="ml-auto"><i className="fa-regular fa-bookmark text-2xl"></i></button>
            </div>
            <p className="font-semibold text-sm">{post.likes.toLocaleString()} likes</p>
            <p className="mt-1 text-sm">
                <span className="font-semibold mr-2 cursor-pointer" onClick={() => onViewProfile(post.user)}>{post.user.name}</span>
                <span className="text-gray-200">{post.caption}</span>
            </p>
            <p className="text-gray-400 text-xs mt-2 cursor-pointer">View all {post.comments} comments</p>
        </div>
    </div>
);


const FeedView: React.FC<FeedViewProps> = ({ posts, onViewProfile, onNavigate }) => {
    const [viewingStories, setViewingStories] = useState(false);

    return (
        <div>
            <FeedHeader onNavigate={onNavigate} />
            {mockStories.length > 0 && <StoryTray stories={mockStories} onStoryClick={() => setViewingStories(true)} />}
            <div>
                {posts.length > 0 ? (
                    posts.map(post => <PostCard key={post.id} post={post} onViewProfile={onViewProfile} />)
                ) : (
                    <div className="text-center p-16 text-gray-400">
                        <i className="fa-solid fa-camera-retro text-5xl mb-4"></i>
                        <h2 className="text-xl font-bold">Welcome to MP SOCIAL!</h2>
                        <p>It's quiet in here. Be the first to share a moment.</p>
                    </div>
                )}
            </div>
            {viewingStories && <StoryViewer stories={mockStories} onClose={() => setViewingStories(false)} />}
        </div>
    );
};

export default FeedView;