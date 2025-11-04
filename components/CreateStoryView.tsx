import React, { useState } from 'react';

interface CreateStoryViewProps {
    onPost: (mediaUrl: string, type: 'image' | 'video') => void;
    onClose: () => void;
    t: (key: any) => string;
}

const CreateStoryView: React.FC<CreateStoryViewProps> = ({ onPost, onClose, t }) => {
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setMediaPreview(objectUrl);
            if (file.type.startsWith('video/')) {
                setMediaType('video');
            } else {
                setMediaType('image');
            }
        }
    };

    const handlePost = () => {
        if (mediaPreview && mediaType) {
            onPost(mediaPreview, mediaType);
        }
    };

    return (
        <div className="h-full flex flex-col bg-nexus-dark">
            <header className="flex justify-between items-center p-4">
                <button onClick={onClose}>
                    <i className="fa-solid fa-times text-2xl"></i>
                </button>
                <h1 className="text-xl font-bold">{t('create_story_title')}</h1>
                <div className="w-8"></div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full aspect-[9/16] bg-nexus-light-gray rounded-lg flex flex-col items-center justify-center text-center p-4 overflow-hidden">
                    {mediaPreview ? (
                        <>
                            {mediaType === 'image' && <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />}
                            {mediaType === 'video' && <video src={mediaPreview} className="w-full h-full object-cover" autoPlay loop muted playsInline />}
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-photo-film text-5xl text-gray-400 mb-4"></i>
                            <p className="text-gray-300 mb-4">{t('select_photo_prompt')}</p>
                            <label htmlFor="story-file-upload" className="bg-nexus-secondary text-white font-semibold py-2 px-5 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                                {t('select_from_computer_button')}
                            </label>
                            <input id="story-file-upload" type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                        </>
                    )}
                </div>
            </main>
            
            {mediaPreview && (
                <footer className="p-4">
                    <button
                        onClick={handlePost}
                        className="w-full bg-nexus-secondary text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                    >
                        <span>{t('share_story_button')}</span>
                        <i className="fa-solid fa-arrow-up"></i>
                    </button>
                </footer>
            )}
        </div>
    );
};

export default CreateStoryView;
