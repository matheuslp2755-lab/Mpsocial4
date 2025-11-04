import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { SparklesIcon } from './icons/Icon';
import { Community } from '../types';

interface CreatePostViewProps {
    onPost: (caption: string, mediaUrl: string, community?: Community) => void;
    communities: Community[];
    t: (key: any) => string;
}

const CreatePostView: React.FC<CreatePostViewProps> = ({ onPost, communities, t }) => {
    const [caption, setCaption] = useState('');
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mode, setMode] = useState<'upload' | 'generate'>('upload');
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [selectedCommunityId, setSelectedCommunityId] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setMediaPreview(objectUrl);
            setError('');
        }
    };
    
    const handlePost = () => {
        if (mediaPreview && caption) {
            const selectedCommunity = communities.find(c => c.id === selectedCommunityId);
            onPost(caption, mediaPreview, selectedCommunity);
        }
    }

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setError('');
        setMediaPreview(null);
        try {
            const imageUrl = await generateImage(prompt);
            setMediaPreview(imageUrl);
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className="p-4">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{t('create_post_title')}</h1>
                 <button 
                    onClick={handlePost} 
                    className="font-bold text-nexus-secondary disabled:text-gray-500"
                    disabled={!mediaPreview || !caption || isGenerating}
                >
                    {t('share_button')}
                </button>
            </header>

            <div className="space-y-4">
                <div className="flex bg-nexus-light-gray p-1 rounded-lg">
                    <button 
                        onClick={() => { setMode('upload'); setMediaPreview(null); setError(''); }}
                        className={`w-1/2 py-2 rounded-md font-semibold text-sm transition-colors ${mode === 'upload' ? 'bg-nexus-gray' : 'hover:bg-nexus-gray/50'}`}
                    >
                        {t('upload_tab')}
                    </button>
                    <button 
                        onClick={() => { setMode('generate'); setMediaPreview(null); setError(''); }}
                        className={`w-1/2 py-2 rounded-md font-semibold text-sm transition-colors ${mode === 'generate' ? 'bg-nexus-gray' : 'hover:bg-nexus-gray/50'}`}
                    >
                        {t('generate_ai_tab')}
                    </button>
                </div>
            
                <div className="aspect-square bg-nexus-light-gray rounded-lg flex flex-col items-center justify-center text-center p-4 overflow-hidden">
                    {mediaPreview ? (
                        <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover"/>
                    ) : isGenerating ? (
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nexus-secondary"></div>
                            <p className="mt-4 text-gray-300">{t('generating_vision_prompt')}</p>
                        </div>
                    ) : mode === 'upload' ? (
                        <>
                            <i className="fa-solid fa-photo-film text-4xl text-gray-400 mb-2"></i>
                            <p className="text-gray-400">{t('select_photo_prompt')}</p>
                            <label htmlFor="file-upload" className="mt-4 bg-nexus-secondary text-white font-semibold py-2 px-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                                {t('select_from_computer_button')}
                            </label>
                            <input id="file-upload" type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                        </>
                    ) : ( 
                        <div className="w-full h-full flex flex-col justify-center items-center">
                            <SparklesIcon />
                            <p className="text-gray-300 my-2 text-sm">{t('describe_vision_prompt')}</p>
                            <textarea
                                placeholder="e.g., A cyberpunk city skyline at dusk, neon lights reflecting on wet streets"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={3}
                                className="w-full bg-nexus-gray rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nexus-secondary resize-none mb-2 text-sm"
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={!prompt || isGenerating}
                                className="w-full bg-nexus-secondary text-white font-semibold py-2 px-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {t('generate_button')}
                            </button>
                        </div>
                    )}
                </div>
                
                {error && <p className="text-red-400 text-sm text-center -mt-2 pb-2">{error}</p>}
               
                <textarea
                    placeholder={t('caption_placeholder')}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={4}
                    className="w-full bg-nexus-light-gray rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nexus-secondary resize-none"
                />

                <div>
                    <label htmlFor="community-select" className="text-sm text-gray-400">{t('tag_community_label')}</label>
                    <select
                        id="community-select"
                        value={selectedCommunityId}
                        onChange={(e) => setSelectedCommunityId(e.target.value)}
                        className="w-full bg-nexus-light-gray rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-nexus-secondary"
                    >
                        <option value="">{t('none_option')}</option>
                        {communities.map(community => (
                            <option key={community.id} value={community.id}>{community.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default CreatePostView;