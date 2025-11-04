import React, { useState, useEffect } from 'react';
import { ChatConversation, User, View, Post, Comment, Story, Community } from './types';
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
import CommunityView from './components/CommunityView';
import { translations } from './i18n';
import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, arrayUnion, arrayRemove, query, where } from "firebase/firestore";
import { mockCommunities } from './data/mockData';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [communities, setCommunities] = useState<Community[]>(mockCommunities);

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
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isNewUserSetup, setIsNewUserSetup] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [viewingCommentsForPost, setViewingCommentsForPost] = useState<Post | null>(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [viewingStoriesOfUser, setViewingStoriesOfUser] = useState<User | null>(null);

  const handleLogin = async (username: string, password?: string) => {
    const usersCollection = collection(db, "usuarios");
    const q = query(usersCollection, where("name", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return { success: false, error: t('invalid_credentials_error') };
    }

    const userDoc = querySnapshot.docs[0];
    const data = userDoc.data();
    // Manually construct a plain user object to avoid circular references from Firestore's complex objects
    const user: User = {
        id: userDoc.id,
        name: data.name,
        avatarUrl: data.avatarUrl,
        nickname: data.nickname,
        bio: data.bio,
        password: data.password,
        followers: data.followers,
        following: data.following,
        joinedCommunities: data.joinedCommunities || []
    };


    if (user.password === password) {
        setCurrentUser(user);
        return { success: true };
    } else {
        return { success: false, error: t('invalid_credentials_error') };
    }
  };
    
  const handleSignup = async (newUserPartial: Omit<User, 'id'>) => {
    const { name } = newUserPartial;
    const usersCollection = collection(db, "usuarios");
    const q = query(usersCollection, where("name", "==", name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        return { success: false, error: t('username_taken_error') };
    }

    const newUserId = `u${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newUser: User = {
        id: newUserId,
        ...newUserPartial,
    };
    
    await setDoc(doc(db, "usuarios", newUser.id), newUser);
    
    setCurrentUser(newUser);

    setShowWelcome(true);
    setIsNewUserSetup(true);
    setTimeout(() => {
        setShowWelcome(false);
        setIsEditingProfile(true); 
    }, 2500);

    return { success: true };
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedProfileUser(null);
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
    
  const handleSaveProfile = async (updatedUser: User) => {
    const userRef = doc(db, "usuarios", updatedUser.id);
    await setDoc(userRef, updatedUser, { merge: true });

    setCurrentUser(updatedUser);
    setIsEditingProfile(false);
    setIsNewUserSetup(false);
    setIsSearching(false); // Close search view if open
  };

  const handleCreatePost = (caption: string, mediaUrl: string, community?: Community) => {
    if (!currentUser) return;
    
    const newPost: Post = {
      id: `p${Date.now()}`,
      user: currentUser,
      type: 'image', // Simplified for this example
      contentUrl: mediaUrl,
      caption,
      likes: [],
      comments: [],
      communityId: community?.id,
      communityName: community?.name,
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
    setSelectedCommunity(null);
  };

  const handleFollowToggle = async (targetUserId: string) => {
    if (!currentUser) return;
    const currentUserId = currentUser.id;

    const currentUserRef = doc(db, "usuarios", currentUserId);
    const targetUserRef = doc(db, "usuarios", targetUserId);
    const isFollowing = currentUser.following?.includes(targetUserId);

    try {
        // Step 1: Update Firestore documents
        await Promise.all([
            updateDoc(currentUserRef, { following: isFollowing ? arrayRemove(targetUserId) : arrayUnion(targetUserId) }),
            updateDoc(targetUserRef, { followers: isFollowing ? arrayRemove(currentUserId) : arrayUnion(currentUserId) })
        ]);

        // Step 2: Optimistically update local state for immediate UI feedback
        const updatedFollowingList = isFollowing
            ? currentUser.following?.filter(id => id !== targetUserId)
            : [...(currentUser.following || []), targetUserId];
        
        setCurrentUser(prev => prev ? { ...prev, following: updatedFollowingList } : null);

        if (selectedProfileUser && selectedProfileUser.id === targetUserId) {
            const updatedFollowersList = isFollowing
                ? selectedProfileUser.followers?.filter(id => id !== currentUserId)
                : [...(selectedProfileUser.followers || []), currentUserId];
            
            setSelectedProfileUser(prev => prev ? { ...prev, followers: updatedFollowersList } : null);
        }

        // Step 3: Create a new conversation if the user starts following
        if (!isFollowing) {
            const userDoc = await getDoc(targetUserRef);
            if (userDoc.exists()) {
                const data = userDoc.data();
                // Manually construct a plain user object
                const targetUser: User = { 
                    id: userDoc.id,
                    name: data.name,
                    avatarUrl: data.avatarUrl,
                    nickname: data.nickname,
                    bio: data.bio,
                    password: data.password,
                    followers: data.followers,
                    following: data.following,
                    joinedCommunities: data.joinedCommunities || [],
                };
                setConversations(prevConvos => {
                    const conversationExists = prevConvos.some(c => c.user.id === targetUserId);
                    if (!conversationExists) {
                        const newConversation: ChatConversation = {
                            id: `c${currentUserId}-${targetUserId}`,
                            user: targetUser,
                            lastMessage: t('start_conversation_prompt', { name: targetUser.name }),
                            lastMessageTime: '',
                            messages: [],
                        };
                        return [newConversation, ...prevConvos];
                    }
                    return prevConvos;
                });
            }
        }
    } catch (error) {
        console.error("Error updating follow status: ", error);
        // Optionally revert state on error
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

  const handleCommunityJoinToggle = async (communityId: string) => {
    if (!currentUser) return;

    const userRef = doc(db, "usuarios", currentUser.id);
    const isMember = currentUser.joinedCommunities?.includes(communityId);

    try {
      // Update Firestore
      await updateDoc(userRef, {
        joinedCommunities: isMember ? arrayRemove(communityId) : arrayUnion(communityId)
      });
      
      // Update local state for immediate feedback
      const updatedJoinedCommunities = isMember
        ? currentUser.joinedCommunities?.filter(id => id !== communityId)
        : [...(currentUser.joinedCommunities || []), communityId];
      
      setCurrentUser(prev => prev ? { ...prev, joinedCommunities: updatedJoinedCommunities } : null);
      
      // Update member count for UI feedback
      setCommunities(prev => prev.map(c => {
        if (c.id === communityId) {
          return { ...c, members: isMember ? c.members - 1 : c.members + 1 };
        }
        return c;
      }));
      // Update selected community if it's the one being modified
      if(selectedCommunity?.id === communityId) {
        setSelectedCommunity(prev => prev ? {...prev, members: isMember ? prev.members - 1 : prev.members + 1} : null);
      }
    } catch (error) {
      console.error("Error updating community membership:", error);
    }
  };

  const handleViewCommunityById = (communityId: string) => {
    const community = communities.find(c => c.id === communityId);
    if (community) {
      setSelectedCommunity(community);
    }
  };

  const navigate = (view: View) => {
    setActiveView(view);
    setSelectedCommunity(null);
    setSelectedProfileUser(null);
  }
  
  if (showWelcome && currentUser) {
    return <WelcomeView user={currentUser} t={t} />;
  }

  if (!currentUser) {
    return authScreen === 'login' ? (
      <LoginView 
        onLoginSuccess={handleLogin} 
        onSwitchToSignup={() => setAuthScreen('signup')} 
        language={language}
        setLanguage={setLanguage}
        t={t}
      />
    ) : (
      <SignupView 
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
  
  if (selectedCommunity) {
    return <CommunityView
        community={selectedCommunity}
        posts={posts}
        currentUser={currentUser}
        onBack={() => setSelectedCommunity(null)}
        onViewProfile={handleViewProfile}
        onLikeToggle={handleLikeToggle}
        onViewComments={setViewingCommentsForPost}
        onCommunityJoinToggle={handleCommunityJoinToggle}
        onViewCommunityById={handleViewCommunityById}
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
                onViewCommunityById={handleViewCommunityById}
                t={t} 
            />
        }
        {activeView === View.Explore && <ExploreView t={t} onSearchClick={() => setIsSearching(true)} onSelectCommunity={setSelectedCommunity} communities={communities} currentUser={currentUser} onCommunityJoinToggle={handleCommunityJoinToggle} />}
        {activeView === View.Create && <CreatePostView onPost={handleCreatePost} communities={communities} t={t} />}
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
      <BottomNav activeView={activeView} setActiveView={(view) => navigate(view)} t={t} />
    </div>
  );
};

export default App;