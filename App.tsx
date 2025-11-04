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
    const savedUsers = localStorage.getItem('nexus_users');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    localStorage.setItem('nexus_users', JSON.stringify(mockUsers));
    return mockUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('nexus_currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem('nexus_posts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });

  useEffect(() => {
    localStorage.setItem('nexus_posts', JSON.stringify(posts));
  }, [posts]);


  const [activeView, setActiveView] = useState<View>(View.Feed);
  
  const [showWelcome, setShowWelcome] = useState(false);
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');
  
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('nexus_currentUser', JSON.stringify(user));
  };
    
  const handleSignup = (newUser: User) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('nexus_users', JSON.stringify(updatedUsers));
    setCurrentUser(newUser);
    localStorage.setItem('nexus_currentUser', JSON.stringify(newUser));
    setShowWelcome(true);
    setTimeout(() => setShowWelcome(false), 2500);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedProfileUser(null);
    localStorage.removeItem('nexus_currentUser');
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
    localStorage.setItem('nexus_currentUser', JSON.stringify(updatedUser));
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem('nexus_users', JSON.stringify(updatedUsers));
    setIsEditingProfile(false);
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

    // This ensures that we update the currentUser state with the correct data
    const updatedCurrentUser = {
        ...currentUser,
        following: isFollowing
            ? currentUser.following?.filter(id => id !== targetUserId)
            : [...(currentUser.following || []), targetUserId],
    };

    const updatedUsers = users.map(user => {
        // Update the target user's followers
        if (user.id === targetUserId) {
            return {
                ...user,
                followers: isFollowing
                    ? user.followers?.filter(id => id !== currentUser.id)
                    : [...(user.followers || []), currentUser.id],
            };
        }
        // Update the current user's data within the main users list
        if (user.id === currentUser.id) {
            return updatedCurrentUser;
        }
        return user;
    });

    setCurrentUser(updatedCurrentUser);
    setUsers(updatedUsers);
    // Also update selectedProfileUser if they are the one being followed/unfollowed
    if (selectedProfileUser?.id === targetUserId) {
      setSelectedProfileUser(users.find(u => u.id === targetUserId) || null);
    }
    
    localStorage.setItem('nexus_currentUser', JSON.stringify(updatedCurrentUser));
    localStorage.setItem('nexus_users', JSON.stringify(updatedUsers));
  };
  
  const navigate = (view: View) => {
    if (view !== View.Profile) {
        setSelectedProfileUser(null);
    }
     if (view === View.Profile && selectedProfileUser) {
        // Don't clear selected profile user if we are already on a profile
    } else {
        setSelectedProfileUser(null);
    }
    setActiveView(view);
  };


  if (!currentUser) {
    return authScreen === 'login' 
      ? <LoginView users={users} onLoginSuccess={handleLogin} onSwitchToSignup={() => setAuthScreen('signup')} />
      : <SignupView users={users} onSignupSuccess={handleSignup} onSwitchToLogin={() => setAuthScreen('login')} />;
  }

  if (showWelcome) {
    return <WelcomeView user={currentUser} />;
  }

  const renderCurrentView = () => {
    const profileToShow = selectedProfileUser || currentUser;
    
    if (isEditingProfile) {
      return <EditProfileView user={currentUser} onSave={handleSaveProfile} onCancel={() => setIsEditingProfile(false)} />;
    }
    if (selectedConversation) {
      return <ChatView conversation={selectedConversation} currentUser={currentUser} onBack={() => setSelectedConversation(null)} onSendMessage={handleSendMessage} />;
    }
    switch (activeView) {
      case View.Feed:
        return <FeedView posts={posts} onViewProfile={handleViewProfile} onNavigate={navigate} />;
      case View.Communities:
        return <CommunitiesView />;
      case View.Create:
        return <CreatePostView onPost={handleCreatePost} />;
      case View.Chat:
        return <ChatListView conversations={conversations} onSelectConversation={setSelectedConversation} />;
      case View.Profile:
        return <ProfileView 
                  profileUser={profileToShow} 
                  currentUser={currentUser}
                  posts={posts} 
                  onEditProfile={() => setIsEditingProfile(true)} 
                  onLogout={handleLogout}
                  onFollowToggle={handleFollowToggle}
                />;
      default:
        return <FeedView posts={posts} onViewProfile={handleViewProfile} onNavigate={navigate} />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-nexus-dark text-white min-h-screen font-sans pb-20">
      <main>
        {renderCurrentView()}
      </main>
      <BottomNav activeView={activeView} setActiveView={navigate} />
    </div>
  );
};

export default App;