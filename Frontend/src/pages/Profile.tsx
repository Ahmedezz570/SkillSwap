import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Save } from 'lucide-react';

const Profile = () => {
  const { currentUser, updateUserProfile } = useApp();
  const { toast } = useToast();

  if (!currentUser) return null;

  const [formData, setFormData] = useState({
    name: currentUser.user.fullName || '',
    bio: currentUser.user.bio || '',
    canTeach: currentUser.user.skillsICanTeach?.join(', ') || '',
    wantsToLearn: currentUser.user.skillsIWantToLearn?.join(', ') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedData = {
      fullName: formData.name,
      bio: formData.bio,
      skillsICanTeach: formData.canTeach.split(',').map(skill => skill.trim()).filter(Boolean),
      skillsIWantToLearn: formData.wantsToLearn.split(',').map(skill => skill.trim()).filter(Boolean)
    };

    updateUserProfile(updatedData);
    toast({
      title: "Profile updated!",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-600 mt-2">Update your information and skills.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </CardTitle>
            <CardDescription>Your basic information and bio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={currentUser.user.avatar || ""} />
                <AvatarFallback className="text-lg">{currentUser.user.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{currentUser.user.fullName}</h3>
                <p className="text-gray-600">{currentUser.user.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm">
                    ⭐ {(currentUser.user.rating || 23).toFixed(1)} rating
                  </span>
                  <span className="text-sm">
                    📚 {currentUser.user.sessionsCompleted || 23} sessions completed
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Update Information</CardTitle>
            <CardDescription>Modify your profile details and skills</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="canTeach">Skills I Can Teach</Label>
                  <Textarea
                    id="canTeach"
                    name="canTeach"
                    value={formData.canTeach}
                    onChange={handleChange}
                    placeholder="React, JavaScript, CSS (comma separated)"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500">
                    Current: {currentUser?.user.skillsICanTeach.length} skill{currentUser?.user.skillsICanTeach.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wantsToLearn">Skills I Want to Learn</Label>
                  <Textarea
                    id="wantsToLearn"
                    name="wantsToLearn"
                    value={formData.wantsToLearn}
                    onChange={handleChange}
                    placeholder="Python, Machine Learning (comma separated)"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500">
                    Current: {currentUser?.user.skillsIWantToLearn.length} skill{currentUser?.user.skillsIWantToLearn.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <Button type="submit" className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
