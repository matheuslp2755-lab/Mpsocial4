import React from 'react';
import { Post, Story, User, View } from '../types';
import PostCard from './PostCard';

interface FeedViewProps {
    posts: Post[];
    stories: Story[];
    currentUser: User;
    onViewProfile: (user: User) => void;
    onNavigate: (view: View) => void;
    onLikeToggle: (postId: string) => void;
    onViewComments: (post: Post) => void;
    onAddStoryClick: () => void;
    onViewStories: (user: User) => void;
    onViewCommunityById: (communityId: string) => void;
    t: (key: any, params?: any) => string;
}

const FeedHeader: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => (
    <header className="p-4 flex justify-between items-center sticky top-0 bg-nexus-dark/80 backdrop-blur-lg z-10">
        <h1 className="text-3xl font-bold font-serif">MP SOCIAL</h1>
        <div className="flex items-center space-x-5">
            <button onClick={() => onNavigate(View.Create)} aria-label="Create Post"><i className="fa-regular fa-plus-square text-2xl"></i></button>
            <button aria-label="Notifications"><i className="fa-regular fa-heart text-2xl"></i></button>
            <button onClick={() => onNavigate(View.Chat)} aria-label="Messages"><i className="fa-regular fa-paper-plane text-2xl"></i></button>
        </div>
    </header>
);

const StoryTray: React.FC<{ 
    stories: Story[]; 
    currentUser: User;
    onAddStoryClick: () => void;
    onViewStories: (user: User) => void;
    t: (key: any) => string;
}> = ({ stories, currentUser, onAddStoryClick, onViewStories, t }) => {
    
    const followingIds = currentUser.following || [];
    const storyUsers = stories
        .filter(story => followingIds.includes(story.user.id))
        .reduce((acc, story) => {
            if (!acc.some(u => u.id === story.user.id)) {
                acc.push(story.user);
            }
            return acc;
        }, [] as User[]);

    return (
        <div className="px-4 pt-2 pb-4 border-b border-nexus-light-gray">
            <div className="flex space-x-4 overflow-x-auto pb-2 -mb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {/* Current User's Story */}
                <div className="flex-shrink-0 text-center cursor-pointer" onClick={onAddStoryClick}>
                    <div className="w-16 h-16 rounded-full p-0.5 relative">
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full rounded-full border-2 border-nexus-dark object-cover" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-nexus-secondary rounded-full border-2 border-nexus-dark flex items-center justify-center">
                            <i className="fa-solid fa-plus text-white text-xs"></i>
                        </div>
                    </div>
                    <p className="text-xs mt-1 truncate w-16">{t('your_story')}</p>
                </div>

                {/* Following Users' Stories */}
                {storyUsers.map(user => (
                    <div key={user.id} className="flex-shrink-0 text-center cursor-pointer" onClick={() => onViewStories(user)}>
                        <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600">
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full border-2 border-nexus-dark object-cover" />
                        </div>
                        <p className="text-xs mt-1 truncate w-16">{user.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FeedView: React.FC<FeedViewProps> = ({ posts, stories, currentUser, onViewProfile, onNavigate, onLikeToggle, onViewComments, onAddStoryClick, onViewStories, onViewCommunityById, t }) => {
    const followingIds = currentUser?.following || [];
    const feedPosts = posts.filter(post => followingIds.includes(post.user.id) || post.user.id === currentUser?.id);


    return (
        <div>
            <FeedHeader onNavigate={onNavigate} />
            <StoryTray 
                stories={stories} 
                currentUser={currentUser}
                onAddStoryClick={onAddStoryClick}
                onViewStories={onViewStories}
                t={t}
            />
            <div>
                {feedPosts.length > 0 ? (
                    feedPosts.map(post => <PostCard key={post.id} post={post} currentUser={currentUser} onViewProfile={onViewProfile} onLikeToggle={onLikeToggle} onViewComments={onViewComments} onViewCommunityById={onViewCommunityById} t={t} />)
                ) : (
                     <div className="text-center p-16 text-gray-400">
                        <i className="fa-solid fa-user-plus text-5xl mb-4"></i>
                        <h2 className="text-xl font-bold">{t('feed_empty_title')}</h2>
                        <p>{t('feed_empty_subtitle')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedView;