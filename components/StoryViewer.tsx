import React, { useState, useEffect, useRef } from 'react';
import { Story } from '../types';

interface StoryViewerProps {
    stories: Story[];
    onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, onClose }) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const timerRef = useRef<number | null>(null);

    const currentStory = stories[currentStoryIndex];

    const goToNextStory = () => {
        if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
            setProgress(0);
        } else {
            onClose();
        }
    };

    const goToPreviousStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
            setProgress(0);
        }
    };
    
    useEffect(() => {
        setProgress(0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        const duration = currentStory.duration * 1000;
        const startTime = Date.now();

        timerRef.current = window.setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const newProgress = (elapsedTime / duration) * 100;

            if (newProgress >= 100) {
                goToNextStory();
            } else {
                setProgress(newProgress);
            }
        }, 50);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentStoryIndex, stories]);
    
    useEffect(() => {
        if (currentStory.type === 'video' && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(e => console.error("Video play failed:", e));
        }
    }, [currentStory]);


    if (!currentStory) return null;

    const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX } = e;
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const tapPosition = (clientX - left) / width;

        if (tapPosition < 0.3) {
            goToPreviousStory();
        } else {
            goToNextStory();
        }
    }


    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="absolute top-0 left-0 right-0 p-4 z-10">
                {/* Progress Bars */}
                <div className="flex space-x-1">
                    {stories.map((_, index) => (
                        <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                           <div
                             className="h-full bg-white"
                             style={{ width: `${index < currentStoryIndex ? 100 : (index === currentStoryIndex ? progress : 0)}%` }}
                           ></div>
                        </div>
                    ))}
                </div>
                {/* User Info & Close Button */}
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center">
                        <img src={currentStory.user.avatarUrl} alt={currentStory.user.name} className="w-8 h-8 rounded-full mr-2" />
                        <span className="font-semibold text-white">{currentStory.user.name}</span>
                    </div>
                     <button onClick={onClose} className="text-white">
                        <i className="fa-solid fa-times text-2xl"></i>
                    </button>
                </div>
            </div>
            
            <div className="w-full h-full" onClick={handleTap}>
                 {currentStory.type === 'image' && (
                    <img src={currentStory.contentUrl} alt="Story content" className="w-full h-full object-contain" />
                )}
                {currentStory.type === 'video' && (
                    <video ref={videoRef} src={currentStory.contentUrl} className="w-full h-full object-contain" autoPlay muted playsInline onEnded={goToNextStory}></video>
                )}
            </div>
        </div>
    );
};

export default StoryViewer;
