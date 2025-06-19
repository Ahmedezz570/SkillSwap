import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  canTeach: string[];
  wantsToLearn: string[];
  rating: number;
  sessionsCompleted: number;
  isAdmin?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  senderName: string;
}

interface Booking {
  id: string;
  teacherId: string;
  studentId: string;
  skill: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed';
}

interface AppContextType {
  isLoggedIn: boolean;
  currentUser: User | null;
  users: User[];
  messages: Message[];
  bookings: Booking[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  signup: (userData: Partial<User>) => boolean;
  sendMessage: (receiverId: string, content: string) => void;
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  rateUser: (userId: string, rating: number) => void;
  updateUserProfile: (userData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  updateUser: (userId: string, userData: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Passionate web developer with 5+ years of experience. Love teaching and learning new technologies!',
    canTeach: ['React', 'JavaScript', 'CSS', 'HTML'],
    wantsToLearn: ['Python', 'Machine Learning', 'AWS'],
    rating: 4.8,
    sessionsCompleted: 24,
    isAdmin: true
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Data scientist and Python enthusiast. Always excited to share knowledge and learn from others.',
    canTeach: ['Python', 'Machine Learning', 'Data Analysis'],
    wantsToLearn: ['React', 'Node.js', 'GraphQL'],
    rating: 4.9,
    sessionsCompleted: 18
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'UX/UI designer with a passion for creating beautiful and functional user experiences.',
    canTeach: ['UI/UX Design', 'Figma', 'Adobe Creative Suite'],
    wantsToLearn: ['Frontend Development', 'CSS Animations'],
    rating: 4.7,
    sessionsCompleted: 15
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Full-stack developer and DevOps engineer. Love automating processes and teaching best practices.',
    canTeach: ['Node.js', 'AWS', 'Docker', 'DevOps'],
    wantsToLearn: ['Kubernetes', 'Terraform'],
    rating: 4.6,
    sessionsCompleted: 12
  },
  {
    id: '5',
    name: 'Eva Martinez',
    email: 'eva@example.com',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
    bio: 'Mobile app developer specializing in React Native and Flutter. Passionate about creating cross-platform solutions.',
    canTeach: ['React Native', 'Flutter', 'Mobile Development'],
    wantsToLearn: ['Swift', 'Kotlin'],
    rating: 4.5,
    sessionsCompleted: 9
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    content: 'Hi Alice! I saw you teach React. Would you be interested in a skill swap? I can teach you Python in exchange.',
    timestamp: new Date('2024-01-15T10:30:00'),
    senderName: 'Bob Smith'
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    content: 'Hi Bob! That sounds great! I\'ve been wanting to learn Python for data analysis. When would be a good time for you?',
    timestamp: new Date('2024-01-15T11:15:00'),
    senderName: 'Alice Johnson'
  },
  {
    id: '3',
    senderId: '2',
    receiverId: '1',
    content: 'How about this weekend? We could start with a 1-hour session each way.',
    timestamp: new Date('2024-01-15T11:45:00'),
    senderName: 'Bob Smith'
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Load auth state from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('skillswap_user');
    const savedAuth = localStorage.getItem('skillswap_auth');
    
    if (savedUser && savedAuth === 'true') {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      
      // Save to localStorage
      localStorage.setItem('skillswap_user', JSON.stringify(user));
      localStorage.setItem('skillswap_auth', 'true');
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    
    // Clear localStorage
    localStorage.removeItem('skillswap_user');
    localStorage.removeItem('skillswap_auth');
  };

  const signup = (userData: Partial<User>): boolean => {
    if (!userData.email || !userData.name) return false;
    
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      bio: userData.bio || '',
      canTeach: userData.canTeach || [],
      wantsToLearn: userData.wantsToLearn || [],
      rating: 0,
      sessionsCompleted: 0
    };
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    
    // Save to localStorage
    localStorage.setItem('skillswap_user', JSON.stringify(newUser));
    localStorage.setItem('skillswap_auth', 'true');
    
    return true;
  };

  const sendMessage = (receiverId: string, content: string) => {
    if (!currentUser) return;
    
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      senderId: currentUser.id,
      receiverId,
      content,
      timestamp: new Date(),
      senderName: currentUser.name
    };
    
    setMessages([...messages, newMessage]);
  };

  const addBooking = (booking: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...booking,
      id: (bookings.length + 1).toString()
    };
    setBookings([...bookings, newBooking]);
  };

  const rateUser = (userId: string, rating: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, rating: (user.rating + rating) / 2 }
        : user
    ));
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...userData };
    setCurrentUser(updatedUser);
    setUsers(users.map(user => 
      user.id === currentUser.id ? updatedUser : user
    ));
    
    // Update localStorage
    localStorage.setItem('skillswap_user', JSON.stringify(updatedUser));
  };

  const deleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const updateUser = (userId: string, userData: Partial<User>) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      currentUser,
      users,
      messages,
      bookings,
      login,
      logout,
      signup,
      sendMessage,
      addBooking,
      rateUser,
      updateUserProfile,
      deleteUser,
      updateUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
