import React from 'react';
import { Post, Story, User, View } from '../types';

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


const PostCard: React.FC<{ post: Post; currentUser: User; onViewProfile: (user: User) => void; onLikeToggle: (postId: string) => void; onViewComments: (post: Post) => void; t: (key: any, params?: any) => string; }> = ({ post, currentUser, onViewProfile, onLikeToggle, onViewComments, t }) => {
    const isLiked = post.likes.includes(currentUser.id);
    
    return (
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
                    <img src={post.contentUrl} alt="Post content" className="w-full" onDoubleClick={() => onLikeToggle(post.id)} />
                ) : (
                    <div className="relative">
                        <video src={post.contentUrl} className="w-full" loop playsInline muted onDoubleClick={() => onLikeToggle(post.id)} />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white/50">
                            <i className="fa-solid fa-play text-4xl"></i>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-3">
                <div className="flex items-center space-x-4 mb-2">
                    <button onClick={() => onLikeToggle(post.id)}>
                        <i className={`${isLiked ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart text-2xl transition-transform duration-200 ease-in-out`}></i>
                    </button>
                    <button onClick={() => onViewComments(post)}><i className="fa-regular fa-comment text-2xl"></i></button>
                    <button><i className="fa-regular fa-paper-plane text-2xl"></i></button>
                    <button className="ml-auto"><i className="fa-regular fa-bookmark text-2xl"></i></button>
                </div>
                <p className="font-semibold text-sm">{t('likes_count', { count: post.likes.length.toLocaleString() })}</p>
                <p className="mt-1 text-sm">
                    <span className="font-semibold mr-2 cursor-pointer" onClick={() => onViewProfile(post.user)}>{post.user.name}</span>
                    <span className="text-gray-200">{post.caption}</span>
                </p>
                {post.comments.length > 0 && (
                    <p className="text-gray-400 text-xs mt-2 cursor-pointer" onClick={() => onViewComments(post)}>{t('view_all_comments', { count: post.comments.length })}</p>
                )}
            </div>
        </div>
    );
};


const FeedView: React.FC<FeedViewProps> = ({ posts, stories, currentUser, onViewProfile, onNavigate, onLikeToggle, onViewComments, onAddStoryClick, onViewStories, t }) => {
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
                    feedPosts.map(post => <PostCard key={post.id} post={post} currentUser={currentUser} onViewProfile={onViewProfile} onLikeToggle={onLikeToggle} onViewComments={onViewComments} t={t} />)
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