import React from 'react';
import { Community, Post, User } from '../types';
import PostCard from './PostCard';

interface CommunityViewProps {
    community: Community;
    posts: Post[];
    currentUser: User;
    onBack: () => void;
    onViewProfile: (user: User) => void;
    onLikeToggle: (postId: string) => void;
    onViewComments: (post: Post) => void;
    onCommunityJoinToggle: (communityId: string) => void;
    onViewCommunityById: (communityId: string) => void;
    t: (key: any, params?: any) => string;
}

const CommunityView: React.FC<CommunityViewProps> = ({ community, posts, currentUser, onBack, onViewProfile, onLikeToggle, onViewComments, onCommunityJoinToggle, onViewCommunityById, t }) => {
    const communityPosts = posts.filter(post => post.communityId === community.id);
    const isJoined = currentUser.joinedCommunities?.includes(community.id) || false;

    return (
        <div className="h-full flex flex-col">
            <header className="p-3 border-b border-nexus-light-gray sticky top-0 bg-nexus-dark/90 backdrop-blur-lg z-10">
                <div className="flex items-center">
                    <button onClick={onBack} className="mr-4">
                        <i className="fa-solid fa-arrow-left text-lg"></i>
                    </button>
                    <h2 className="font-bold text-xl">{community.name}</h2>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto">
                <div className="relative h-40">
                    <img src={community.bannerUrl} alt={`${community.name} banner`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-nexus-dark via-nexus-dark/70 to-transparent"></div>
                </div>

                <div className="p-4 -mt-12 relative z-0">
                    <h1 className="text-2xl font-bold">{community.name}</h1>
                    <p className="text-sm text-gray-300 mt-1">{community.description}</p>
                    <p className="text-xs text-gray-400 mt-2">{t('members_count', { count: community.members.toLocaleString() })}</p>
                    <button 
                        onClick={() => onCommunityJoinToggle(community.id)}
                        className={`w-full mt-4 font-semibold py-2 rounded-lg text-sm transition-colors ${
                            isJoined ? 'bg-nexus-light-gray text-white' : 'bg-nexus-secondary text-white'
                        }`}
                    >
                        {isJoined ? t('joined_button') : t('join_button')}
                    </button>
                </div>
                
                <div className="border-t border-nexus-light-gray px-1 pt-1">
                    <h3 className="font-bold p-3">{t('community_posts')}</h3>
                    {communityPosts.length > 0 ? (
                        communityPosts.map(post => (
                            <PostCard 
                                key={post.id} 
                                post={post} 
                                currentUser={currentUser} 
                                onViewProfile={onViewProfile} 
                                onLikeToggle={onLikeToggle} 
                                onViewComments={onViewComments}
                                onViewCommunityById={onViewCommunityById}
                                t={t} 
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-10">{t('feed_empty_title')}</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CommunityView;
