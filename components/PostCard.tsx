import React from 'react';
import { Post, User } from '../types';

interface PostCardProps {
    post: Post;
    currentUser: User;
    onViewProfile: (user: User) => void;
    onLikeToggle: (postId: string) => void;
    onViewComments: (post: Post) => void;
    onViewCommunityById: (communityId: string) => void;
    t: (key: any, params?: any) => string;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, onViewProfile, onLikeToggle, onViewComments, onViewCommunityById, t }) => {
    const isLiked = post.likes.includes(currentUser.id);
    
    return (
        <div className="mb-4 border-b border-nexus-light-gray pb-2">
            <div className="flex items-center p-3">
                <div className="flex items-center cursor-pointer" onClick={() => onViewProfile(post.user)}>
                    <img src={post.user.avatarUrl} alt={post.user.name} className="w-9 h-9 rounded-full mr-3" />
                    <div>
                        <span className="font-semibold">{post.user.name}</span>
                        {post.communityName && post.communityId && (
                             <div className="text-xs text-gray-400">
                                {t('posted_in')}{' '}
                                <span className="font-semibold text-gray-300 cursor-pointer hover:underline" onClick={(e) => { e.stopPropagation(); onViewCommunityById(post.communityId!); }}>
                                    {post.communityName}
                                </span>
                            </div>
                        )}
                    </div>
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

export default PostCard;
