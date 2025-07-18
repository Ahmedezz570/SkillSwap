
  import { useState , useEffect} from 'react';
  import { useApp } from '@/contexts/AppContext';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Textarea } from '@/components/ui/textarea';
  import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
  import { Badge } from '@/components/ui/badge';
  import { useToast } from '@/hooks/use-toast';
  import { 
    Users, 
    Trash2, 
    Edit, 
    Star, 
    BookOpen, 
    MessageSquare, 
    Calendar,
    BarChart3,
    Activity,
    Save,
    X
  } from 'lucide-react';
  import { Navigate } from 'react-router-dom';

  const Admin = () => {
    const { currentUser, users, messages, bookings, deleteUser, updateUser } = useApp();
    const { toast } = useToast();
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [allUsers, setAllUsers] = useState([]);
    const [editForm, setEditForm] = useState({
      fullName: "",
    email: "",
    bio: "",
    skillsICanTeach: "", 
    skillsIWantToLearn: "",
    });
    
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await fetch('http://localhost:2000/api/users');
          const data = await response.json();
          setAllUsers(data);
          console.log(data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchUsers();
    }, []);
    if (currentUser?.user.role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }
const handleDeleteUser = async (userId: string, userName: string) => {
  if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
    try {
      const response = await fetch(`http://localhost:2000/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Remove the user from the state
      setAllUsers(prevUsers => prevUsers.filter(user => user._id !== userId));

      toast({
        title: "User deleted",
        description: `${userName} has been removed from the platform.`,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
      });
    }
  }
};


    const handleEditUser = (user: any) => {
      setEditingUser(user.id);
      setEditForm({
        fullName: user.fullName,
        email: user.email,
        bio: user.bio,
        skillsICanTeach: user.skillsICanTeach.join(', '),
        skillsIWantToLearn: user.skillsIWantToLearn.join(', ')
      });
    };

  const handleSaveUser = async (userId: string) => {
  const updatedData = {
    fullName: editForm.fullName,
    email: editForm.email,
    bio: editForm.bio,
    skillsICanTeach: editForm.skillsICanTeach.split(',').map(skill => skill.trim()).filter(Boolean),
    skillsIWantToLearn: editForm.skillsIWantToLearn.split(',').map(skill => skill.trim()).filter(Boolean),
  };

  try {
    const response = await fetch(`http://localhost:2000/api/users/${userId}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    const updatedUser = await response.json();
   
    setAllUsers(prevUsers =>
      prevUsers.map(user => (user._id === userId ? updatedUser : user))
    );

    setEditingUser(null);
    toast({
      title: "User updated",
      description: "User information has been successfully updated.",
    });
  } catch (error) {
    console.error('Error updating user:', error);
    toast({
      title: "Error",
      description: "Failed to update user. Please try again.",
    });
  }
};


    const handleCancelEdit = () => {
      setEditingUser(null);
      setEditForm({ name: '', email: '', bio: '', canTeach: '', wantsToLearn: '' });
    };

    const totalUsers = allUsers.length;
    const totalSessions = users.reduce((sum, user) => sum + user.sessionsCompleted, 0);
    const averageRating = users.reduce((sum, user) => sum + user.rating, 0) / totalUsers;
    const totalMessages = messages.length;
    const activeUsers = users.filter(user => user.sessionsCompleted > 0).length;

    // Chat activity analysis
    const chatActivity = messages.reduce((acc, message) => {
      const date = message.timestamp.toDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentChatActivity = Object.entries(chatActivity)
      .slice(-7)
      .map(([date, count]) => ({ date, count }));

    // Session analytics
    const sessionsByUser = users.map(user => ({
      name: user.name,
      sessions: user.sessionsCompleted,
      rating: user.rating
    })).sort((a, b) => b.sessions - a.sessions);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage users and monitor platform activity.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSessions}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMessages}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Session Analytics
              </CardTitle>
              <CardDescription>Top users by session count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessionsByUser.slice(0, 5).map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{user.name}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{user.sessions} sessions</Badge>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs ml-1">{user.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Chat Activity Monitor
              </CardTitle>
              <CardDescription>Daily message count (last 7 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentChatActivity.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                    <Badge variant="outline">{day.count} messages</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Management Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              View, edit, and manage all platform users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {editingUser === user.id ? (
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`name-${user.id}`}>Name</Label>
                          <Input
                            id={`name-${user.id}`}
                            value={editForm.fullName}
                            onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`email-${user.id}`}>Email</Label>
                          <Input
                            id={`email-${user.id}`}
                            value={editForm.email}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`bio-${user.id}`}>Bio</Label>
                        <Textarea
                          id={`bio-${user.id}`}
                          value={editForm.bio}
                          onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`canTeach-${user.id}`}>Can Teach (comma separated)</Label>
                          <Input
                            id={`canTeach-${user.id}`}
                            value={editForm.skillsICanTeach}
                            onChange={(e) => setEditForm({...editForm, skillsICanTeach: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`wantsToLearn-${user.id}`}>Wants to Learn (comma separated)</Label>
                          <Input
                            id={`wantsToLearn-${user.id}`}
                            value={editForm.skillsIWantToLearn}
                            onChange={(e) => setEditForm({...editForm, skillsIWantToLearn: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleSaveUser(user._id)}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-4 flex-1">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{user.fullName}</h3>
                            {user.isAdmin && (
                              <Badge variant="secondary" className="text-xs">Admin</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500 truncate">{user.bio}</p>
                        </div>
                        
                        {/* <div className="hidden md:block text-center">
                          <p className="text-sm font-medium">{user.sessionsCompleted}</p>
                          <p className="text-xs text-gray-500">Sessions</p>
                        </div> */}
                        
                        <div className="hidden md:block text-center">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            {/* <span className="text-sm font-medium">{user.rating.toFixed(1)}</span> */}
                          </div>
                        </div>
                        
                        <div className="hidden lg:block">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {user.skillsICanTeach.slice(0, 3).map(skill => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {user.skillsICanTeach.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.skillsICanTeach.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user._id, user.fullName)}
                          disabled={user.isAdmin}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )
                  } 
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  export default Admin;
