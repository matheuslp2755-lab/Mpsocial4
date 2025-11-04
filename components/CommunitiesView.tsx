import React from 'react';
import { Community } from '../types';
import { mockCommunities } from '../data/mockData';

const CommunitiesHeader: React.FC = () => (
    <header className="p-4 sticky top-0 bg-nexus-dark/80 backdrop-blur-lg z-10">
        <h1 className="text-2xl font-bold text-center">Communities</h1>
    </header>
);

const CommunityCard: React.FC<{ community: Community }> = ({ community }) => (
    <div className="relative rounded-xl overflow-hidden mb-4">
        <img src={community.bannerUrl} alt={community.name} className="w-full h-32 object-cover" />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-4">
            <h3 className="font-bold text-lg">{community.name}</h3>
            <p className="text-xs text-gray-300">{community.description}</p>
            <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">{community.members.toLocaleString()} members</span>
                <button className="bg-nexus-secondary text-white text-xs font-bold py-1 px-3 rounded-full">
                    Join
                </button>
            </div>
        </div>
    </div>
);


const CommunitiesView: React.FC = () => {
  return (
    <div>
        <CommunitiesHeader />
        <div className="p-4">
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Search for communities..."
                    className="w-full bg-nexus-light-gray rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-nexus-secondary"
                />
                <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>

            {mockCommunities.map(community => (
                <CommunityCard key={community.id} community={community} />
            ))}
        </div>
    </div>
  );
};

export default CommunitiesView;
