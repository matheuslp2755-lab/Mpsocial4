import React, { useState } from 'react';
import { User } from '../types';

interface EditProfileViewProps {
    user: User;
    onSave: (updatedUser: User) => void;
    onCancel: () => void;
}

const EditProfileView: React.FC<EditProfileViewProps> = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        nickname: user.nickname || '',
        bio: user.bio || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave({
            ...user,
            name: formData.name,
            nickname: formData.nickname,
            bio: formData.bio,
        });
    };

    return (
        <div className="h-full flex flex-col bg-nexus-dark">
            <header className="flex items-center justify-between p-4 border-b border-nexus-light-gray sticky top-0 bg-nexus-dark/80 backdrop-blur-lg z-10">
                <button onClick={onCancel} className="text-lg">Cancel</button>
                <h1 className="text-xl font-bold">Edit Profile</h1>
                <button onClick={handleSave} className="text-lg font-bold text-nexus-secondary">Save</button>
            </header>

            <main className="flex-1 p-4">
                <div className="flex flex-col items-center mb-6">
                    <img src={user.avatarUrl} alt="avatar" className="w-24 h-24 rounded-full mb-2" />
                    <button className="text-nexus-secondary font-semibold">Change Photo</button>
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