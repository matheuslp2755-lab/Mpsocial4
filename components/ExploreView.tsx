import React from 'react';
import { Community, User } from '../types';

interface ExploreViewProps {
    t: (key: any, params?: any) => string;
    onSearchClick: () => void;
    onSelectCommunity: (community: Community) => void;
    communities: Community[];
    currentUser: User;
    onCommunityJoinToggle: (communityId: string) => void;
}

const ExploreHeader: React.FC<{ t: (key: any) => string }> = ({ t }) => (
    <header className="p-4 sticky top-0 bg-nexus-dark/80 backdrop-blur-lg z-10">
        <h1 className="text-2xl font-bold text-center">{t('communities_title')}</h1>
    </header>
);

const CommunityCard: React.FC<{ 
    community: Community;
    t: (key: any, params?: any) => string;
    isJoined: boolean;
    onJoinClick: () => void;
}> = ({ community, t, isJoined, onJoinClick }) => (
    <div className="relative rounded-xl overflow-hidden mb-4">
        <img src={community.bannerUrl} alt={community.name} className="w-full h-32 object-cover" />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-4">
            <h3 className="font-bold text-lg">{community.name}</h3>
            <p className="text-xs text-gray-300">{community.description}</p>
            <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">{t('members_count', { count: community.members.toLocaleString() })}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onJoinClick(); }}
                  className={`text-white text-xs font-bold py-1 px-3 rounded-full transition-colors ${
                    isJoined ? 'bg-nexus-light-gray' : 'bg-nexus-secondary'
                  }`}>
                    {isJoined ? t('joined_button') : t('join_button')}
                </button>
            </div>
        </div>
    </div>
);


const ExploreView: React.FC<ExploreViewProps> = ({ t, onSearchClick, onSelectCommunity, communities, currentUser, onCommunityJoinToggle }) => {
  return (
    <div>
        <ExploreHeader t={t} />
        <div className="p-4">
            <div className="relative mb-6">
                 <button 
                    onClick={onSearchClick}
                    className="w-full bg-nexus-light-gray rounded-lg px-4 py-3 text-left text-gray-300 flex items-center hover:bg-nexus-gray transition-colors"
                >
                    <i className="fa-solid fa-search mr-3 text-gray-400"></i>
                    {t('search_users_placeholder')}
                </button>
            </div>

            <h2 className="text-lg font-bold mb-3">{t('discover_communities')}</h2>

            {communities.map(community => {
                const isJoined = currentUser.joinedCommunities?.includes(community.id) || false;
                return (
                    <div key={community.id} onClick={() => onSelectCommunity(community)} className="cursor-pointer">
                        <CommunityCard 
                            community={community} 
                            t={t}
                            isJoined={isJoined}
                            onJoinClick={() => onCommunityJoinToggle(community.id)}
                        />
                    </div>
                )
            })}
        </div>
    </div>
  );
};

export default ExploreView;