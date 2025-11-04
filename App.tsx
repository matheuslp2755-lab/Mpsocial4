import React, { useState, useEffect } from 'react';
import { ChatConversation, User, View, Post, Comment, Story } from './types';
import { mockUsers } from './data/mockData';
import BottomNav from './components/BottomNav';
import ChatListView from './components/ChatListView';
import ChatView from './components/ChatView';
import ExploreView from './components/ExploreView';
import CreatePostView from './components/CreatePostView';
import EditProfileView from './components/EditProfileView';
import FeedView from './components/FeedView';
import LoginView from './components/LoginView';
import ProfileView from './components/ProfileView';
import SignupView from './components/SignupView';
import WelcomeView from './components/WelcomeView';
import SearchView from './components/SearchView';
import CommentsView from './components/CommentsView';
import CreateStoryView from './components/CreateStoryView';
import StoryViewer from './components/StoryViewer';
import { translations } from './i18n';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('mp_social_users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('mp_social_currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem('mp_social_posts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });
  
  const [stories, setStories] = useState<Story[]>(() => {
    const savedStories = localStorage.getItem('mp_social_stories');
    return savedStories ? JSON.parse(savedStories) : [];
  });

  const [language, setLanguage] = useState<'en' | 'pt'>(() => {
    const savedLang = localStorage.getItem('mp_social_language');
    return (savedLang === 'en' || savedLang === 'pt') ? savedLang : 'en';
  });

  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    const savedConversations = localStorage.getItem('mp_social_conversations');
    return savedConversations ? JSON.parse(savedConversations) : [];
  });

  useEffect(() => {
    localStorage.setItem('mp_social_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('mp_social_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('mp_social_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('mp_social_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('mp_social_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const t = (key: keyof typeof translations.en, params?: { [key: string]: string | number }) => {
    let text = translations[language][key] || translations.en[key];
    if (params) {
        Object.keys(params).forEach(pKey => {
            text = text.replace(`{${pKey}}`, String(params[pKey]));
        });
    }
    return text;
  };


  const [activeView, setActiveView] = useState<View>(View.Feed);
  
  const [showWelcome, setShowWelcome] = useState(false);
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');
  
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [selectedProfileUser, setSelectedProfileUser] = useState<User | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isNewUserSetup, setIsNewUserSetup] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [viewingCommentsForPost, setViewingCommentsForPost] = useState<Post | null>(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [viewingStoriesOfUser, setViewingStoriesOfUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('mp_social_currentUser', JSON.stringify(user));
  };
    
  const handleSignup = (newUser: User) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
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
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setIsEditingProfile(false);
    setIsNewUserSetup(false);
    setIsSearching(false); // Close search view if open
  };

  const handleCreatePost = (caption: string, mediaUrl: string) => {
    if (!currentUser) return;
    
    const newPost: Post = {
      id: `p${Date.now()}`,
      user: currentUser,
      type: 'image', // Simplified for this example
      contentUrl: mediaUrl,
      caption,
      likes: [],
      comments: [],
    };
    
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setActiveView(View.Feed);
  };

  const handleCreateStory = (mediaUrl: string, type: 'image' | 'video') => {
    if (!currentUser) return;
    
    const newStory: Story = {
        id: `s${Date.now()}`,
        user: currentUser,
        contentUrl: mediaUrl,
        type: type,
        duration: 5, // 5 seconds for images
    };

    setStories(prev => [newStory, ...prev]);
    setIsCreatingStory(false);
  };

  const handleViewProfile = (user: User) => {
    setSelectedProfileUser(user);
    setActiveView(View.Profile);
    setIsSearching(false);
  };

  const handleFollowToggle = (targetUserId: string) => {
    if (!currentUser) return;

    let updatedCurrentUser: User | null = null;
    let targetUser: User | null = null;
    
    const updatedUsers = users.map(u => {
        if (u.id === currentUser.id) {
            const isFollowing = u.following?.includes(targetUserId);
            updatedCurrentUser = {
                ...u,
                following: isFollowing
                    ? u.following?.filter(id => id !== targetUserId)
                    : [...(u.following || []), targetUserId],
            };
            return updatedCurrentUser;
        }
        if (u.id === targetUserId) {
            targetUser = u;
            const isFollowed = u.followers?.includes(currentUser.id);
            const updatedTargetUser = {
                ...u,
                followers: isFollowed
                    ? u.followers?.filter(id => id !== currentUser.id)
                    : [...(u.followers || []), currentUser.id],
            };
            return updatedTargetUser;
        }
        return u;
    });

    if (!updatedCurrentUser || !targetUser) return;
    
    const isFollowing = updatedCurrentUser.following?.includes(targetUserId);

    if (isFollowing) {
        const conversationExists = conversations.some(c => c.user.id === targetUserId);
        if (!conversationExists) {
            const newConversation: ChatConversation = {
                id: `c${currentUser.id}-${targetUserId}`,
                user: targetUser,
                lastMessage: t('start_conversation_prompt', { name: targetUser.name }),
                lastMessageTime: '',
                messages: [],
            };
            setConversations(prev => [newConversation, ...prev]);
        }
    }

    setUsers(updatedUsers);
    setCurrentUser(updatedCurrentUser);
    localStorage.setItem('mp_social_currentUser', JSON.stringify(updatedCurrentUser));

    if (selectedProfileUser && selectedProfileUser.id === targetUserId) {
      const updatedSelectedProfile = updatedUsers.find(u => u.id === targetUserId);
      if (updatedSelectedProfile) {
        setSelectedProfileUser(updatedSelectedProfile);
      }
    }
  };

  const handleLikeToggle = (postId: string) => {
    if (!currentUser) return;
    const currentUserId = currentUser.id;

    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(currentUserId);
          return {
            ...post,
            likes: isLiked
              ? post.likes.filter(id => id !== currentUserId)
              : [...post.likes, currentUserId],
          };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
      if (!currentUser) return;

      const newComment: Comment = {
          id: `comment-${Date.now()}`,
          user: currentUser,
          text,
          timestamp: new Date().toISOString(),
      };

      const updatedPosts = posts.map(post => {
          if (post.id === postId) {
              return {
                  ...post,
                  comments: [...post.comments, newComment],
              };
          }
          return post;
      });

      setPosts(updatedPosts);
      // Also update the post in the comments view if it's open
      if (viewingCommentsForPost && viewingCommentsForPost.id === postId) {
          const updatedPost = updatedPosts.find(p => p.id === postId);
          if (updatedPost) {
              setViewingCommentsForPost(updatedPost);
          }
      }
  };

  const navigate = (view: View) => setActiveView(view);
  
  if (showWelcome && currentUser) {
    return <WelcomeView user={currentUser} t={t} />;
  }

  if (!currentUser) {
    return authScreen === 'login' ? (
      <LoginView 
        users={users} 
        onLoginSuccess={handleLogin} 
        onSwitchToSignup={() => setAuthScreen('signup')} 
        language={language}
        setLanguage={setLanguage}
        t={t}
      />
    ) : (
      <SignupView 
        users={users} 
        onSignupSuccess={handleSignup} 
        onSwitchToLogin={() => setAuthScreen('login')}
        t={t}
        language={language}
      />
    );
  }
  
  if (isCreatingStory) {
    return <CreateStoryView
        onPost={handleCreateStory}
        onClose={() => setIsCreatingStory(false)}
        t={t}
    />;
  }
  
  if (viewingStoriesOfUser) {
    const userStories = stories.filter(s => s.user.id === viewingStoriesOfUser.id);
    return <StoryViewer stories={userStories} onClose={() => setViewingStoriesOfUser(null)} />;
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
        t={t}
    />;
  }

  if (selectedConversation) {
    return <ChatView conversation={selectedConversation} currentUser={currentUser} onBack={() => setSelectedConversation(null)} onSendMessage={handleSendMessage} t={t} />;
  }

  if (viewingCommentsForPost) {
      return <CommentsView
          post={viewingCommentsForPost}
          currentUser={currentUser}
          onAddComment={handleAddComment}
          onBack={() => setViewingCommentsForPost(null)}
          t={t}
      />
  }

  if (isSearching) {
    return <SearchView 
      users={users.filter(u => u.id !== currentUser.id)}
      currentUser={currentUser}
      onFollowToggle={handleFollowToggle}
      onViewProfile={handleViewProfile}
      onClose={() => setIsSearching(false)}
      t={t}
    />
  }

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col pb-16">
      <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {activeView === View.Feed && 
            <FeedView 
                posts={posts} 
                stories={stories}
                currentUser={currentUser} 
                onViewProfile={handleViewProfile} 
                onNavigate={navigate} 
                onLikeToggle={handleLikeToggle} 
                onViewComments={setViewingCommentsForPost} 
                onAddStoryClick={() => setIsCreatingStory(true)}
                onViewStories={setViewingStoriesOfUser}
                t={t} 
            />
        }
        {activeView === View.Explore && <ExploreView t={t} onSearchClick={() => setIsSearching(true)} />}
        {activeView === View.Create && <CreatePostView onPost={handleCreatePost} t={t} />}
        {activeView === View.Chat && <ChatListView conversations={conversations} onSelectConversation={setSelectedConversation} t={t} />}
        {activeView === View.Profile && (
          <ProfileView 
            profileUser={selectedProfileUser || currentUser} 
            currentUser={currentUser} 
            posts={posts} 
            onEditProfile={() => setIsEditingProfile(true)} 
            onLogout={handleLogout}
            onFollowToggle={handleFollowToggle}
            t={t}
            language={language}
          />
        )}
      </main>
      <BottomNav activeView={activeView} setActiveView={setActiveView} t={t} />
    </div>
  );
};

export default App;