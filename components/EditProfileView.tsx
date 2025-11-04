import React, { useState } from 'react';
import { User } from '../types';

interface EditProfileViewProps {
    user: User;
    onSave: (updatedUser: User) => void;
    onCancel: () => void;
    isFirstTime?: boolean;
}

const EditProfileView: React.FC<EditProfileViewProps> = ({ user, onSave, onCancel, isFirstTime = false }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        nickname: user.nickname || '',
        bio: user.bio || '',
    });
    const [newAvatar, setNewAvatar] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSave({
            ...user,
            name: formData.name,
            nickname: formData.nickname,
            bio: formData.bio,
            avatarUrl: newAvatar || user.avatarUrl,
        });
    };

    return (
        <div className="h-full flex flex-col bg-nexus-dark">
            <header className="flex items-center justify-between p-4 border-b border-nexus-light-gray sticky top-0 bg-nexus-dark/80 backdrop-blur-lg z-10">
                <button onClick={onCancel} className="text-lg">Cancel</button>
                <h1 className="text-xl font-bold">Edit Profile</h1>
                <button onClick={handleSave} className="text-lg font-bold text-nexus-secondary">Save</button>
            </header>

            <main className="flex-1 p-4 overflow-y-auto">
                {isFirstTime && (
                    <div className="bg-nexus-secondary/20 text-center p-3 rounded-lg mb-6 border border-nexus-secondary/30">
                        <p className="font-semibold text-white">Welcome to MP SOCIAL!</p>
                        <p className="text-sm text-gray-300 mt-1">Let's get your profile set up. Start by adding a photo.</p>
                    </div>
                )}

                <div className="flex flex-col items-center mb-6">
                    <img src={newAvatar || user.avatarUrl} alt="avatar" className="w-24 h-24 rounded-full mb-2 object-cover" />
                    <label htmlFor="avatar-upload" className="text-nexus-secondary font-semibold cursor-pointer">Change Photo</label>
                    <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400">Username</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-nexus-light-gray rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-nexus-secondary"
                        />
                    </div>
                     <div>
                        <label className="text-sm text-gray-400">Nickname</label>
                        <input
                            type="text"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            className="w-full bg-nexus-light-gray rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-nexus-secondary"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-nexus-light-gray rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-nexus-secondary resize-none"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditProfileView;