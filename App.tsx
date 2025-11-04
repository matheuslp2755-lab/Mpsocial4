import React, { useState, useEffect } from 'react';
import { ChatConversation, User, View, Post } from './types';
import { mockConversations, mockUsers } from './data/mockData';
import BottomNav from './components/BottomNav';
import ChatListView from './components/ChatListView';
import ChatView from './components/ChatView';
import CommunitiesView from './components/CommunitiesView';
import CreatePostView from './components/CreatePostView';
import EditProfileView from './components/EditProfileView';
import FeedView from './components/FeedView';
import LoginView from './components/LoginView';
import ProfileView from './components/ProfileView';
import SignupView from './components/SignupView';
import WelcomeView from './components/WelcomeView';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('mp_social_users');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    localStorage.setItem('mp_social_users', JSON.stringify(mockUsers));
    return mockUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('mp_social_currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem('mp_social_posts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

  useEffect(() => {
    localStorage.setItem('mp_social_posts', JSON.stringify(posts));
  }, [posts]);


  const [activeView, setActiveView] = useState<View>(View.Feed);
  
  const [showWelcome, setShowWelcome] = useState(false);
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');
  
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isNewUserSetup, setIsNewUserSetup] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('mp_social_currentUser', JSON.stringify(user));
  };
    
  const handleSignup = (newUser: User) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('mp_social_users', JSON.stringify(updatedUsers));
    setCurrentUser(newUser);
    localStorage.setItem('mp_social_currentUser', JSON.stringify(newUser));
    setShowWelcome(true);
    setIsNewUserSetup(true);
    setTimeout(() => {
        setShowWelcome(false);
        setIsEditingProfile(true); 
    }, 2500);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedProfileUser(null);
    localStorage.removeItem('mp_social_currentUser');
    setActiveView(View.Feed);
    setAuthScreen('login');
  };

  const handleSendMessage = (conversationId: string, text: string) => {
    const newMessage = {
        id: `m${Date.now()}`,
        text,
        isSender: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => 
        prev.map(convo => {
            if (convo.id === conversationId) {
                return {
                    ...convo,
                    messages: [...convo.messages, newMessage],
                    lastMessage: text,
                    lastMessageTime: 'now',
                };
            }
            return convo;
        })
    );
    
    setSelectedConversation(prev => {
        if (!prev || prev.id !== conversationId) return prev;
        return {
            ...prev,
            messages: [...prev.messages, newMessage]
        };
    });
  };
    
  const handleSaveProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('mp_social_currentUser', JSON.stringify(updatedUser));
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('mp_social_users', JSON.stringify(updatedUsers));
    setIsEditingProfile(false);
    setIsNewUserSetup(false);
  };

  const handleCreatePost = (caption: string, mediaUrl: string) => {
    if (!currentUser) return;
    
    const newPost: Post = {
      id: `p${Date.now()}`,
      user: currentUser,
      type: 'image', // Simplified for this example
      contentUrl: mediaUrl,
      caption,
      likes: 0,
      comments: 0,
    };
    
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setActiveView(View.Feed);
  };

  const handleViewProfile = (user: User) => {
    setSelectedProfileUser(user);
    setActiveView(View.Profile);
  };

  const handleFollowToggle = (targetUserId: string) => {
    if (!currentUser) return;

    const isFollowing = currentUser.following?.includes(targetUserId);
    
    const updatedCurrentUser = {
        ...currentUser,
        following: isFollowing
            ? currentUser.following?.filter(id => id !== targetUserId)
            : [...(currentUser.following || []), targetUserId],
    };

    const updatedTargetUser = users.find(u => u.id === targetUserId);
    if (!updatedTargetUser) return;

    const updatedTargetUserWithFollower = {
        ...updatedTargetUser,
        followers: isFollowing
            ? updatedTargetUser.followers?.filter(id => id !== currentUser.id)
            : [...(updatedTargetUser.followers || []), currentUser.id],
    };
    
    const updatedUsers = users.map(u => {
        if (u.id === currentUser.id) return updatedCurrentUser;
        if (u.id === targetUserId) return updatedTargetUserWithFollower;
        return u;
    });

    setUsers(updatedUsers);
    setCurrentUser(updatedCurrentUser);
    localStorage.setItem('mp_social_users', JSON.stringify(updatedUsers));
    localStorage.setItem('mp_social_currentUser', JSON.stringify(updatedCurrentUser));

    // If viewing the toggled profile, update its state
    if (selectedProfileUser && selectedProfileUser.id === targetUserId) {
      const updatedSelectedProfile = updatedUsers.find(u => u.id === targetUserId);
      if (updatedSelectedProfile) {
        setSelectedProfileUser(updatedSelectedProfile);
      }
    }
  };


  const navigate = (view: View) => setActiveView(view);
  
  if (showWelcome && currentUser) {
    return <WelcomeView user={currentUser} />;
  }

  if (!currentUser) {
    return authScreen === 'login' ? (
      <LoginView users={users} onLoginSuccess={handleLogin} onSwitchToSignup={() => setAuthScreen('signup')} />
    ) : (
      <SignupView users={users} onSignupSuccess={handleSignup} onSwitchToLogin={() => setAuthScreen('login')} />
    );
  }
  
  if(isEditingProfile) {
    return <EditProfileView 
        user={currentUser} 
        onSave={handleSaveProfile} 
        onCancel={() => {
            setIsEditingProfile(false);
            setIsNewUserSetup(false);
        }}
        isFirstTime={isNewUserSetup}
    />;
  }

  if (selectedConversation) {
    return <ChatView conversation={selectedConversation} currentUser={currentUser} onBack={() => setSelectedConversation(null)} onSendMessage={handleSendMessage} />;
  }

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col pb-16">
      <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {activeView === View.Feed && <FeedView posts={posts} onViewProfile={handleViewProfile} onNavigate={navigate} />}
        {activeView === View.Communities && <CommunitiesView />}
        {activeView === View.Create && <CreatePostView onPost={handleCreatePost} />}
        {activeView === View.Chat && <ChatListView conversations={conversations} onSelectConversation={setSelectedConversation} />}
        {activeView === View.Profile && (
          <ProfileView 
            profileUser={selectedProfileUser || currentUser} 
            currentUser={currentUser} 
            posts={posts} 
            onEditProfile={() => setIsEditingProfile(true)} 
            onLogout={handleLogout}
            onFollowToggle={handleFollowToggle}
          />
        )}
      </main>
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

export default App;