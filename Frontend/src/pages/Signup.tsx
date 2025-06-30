
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    bio: '',
    skillsICanTeach: '',
    skillsIWantToLearn: '',
    role: 'user'
  });
  const { signup, isLoggedIn } = useApp();
  const { toast } = useToast();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      ...formData,
      skillsICanTeach: formData.skillsICanTeach.split(',').map(skill => skill.trim()).filter(Boolean),
      skillsIWantToLearn: formData.skillsIWantToLearn.split(',').map(skill => skill.trim()).filter(Boolean)
    };
    console.log("userData",userData);
    
    const success = await signup(userData);
    if (success) {
      toast({
        title: "Welcome to SkillSwap!",
        description: "Your account has been created successfully.",
      });
      <Navigate to="/login" replace />;
    } else {
      toast({
        title: "Signup failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    console.log(formData)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-skillswap-50 to-skillswap-100 px-4 py-8">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold gradient-bg bg-clip-text text-transparent">
            Join SkillSwap
          </CardTitle>
          <CardDescription>
            Create your account and start learning
          </CardDescription>
        </CardHeader>
        <CardContent>


          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="yourName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="yourEmail@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skillsICanTeach">Skills I Can Teach</Label>
              <Input
                id="skillsICanTeach"
                name="skillsICanTeach"
                placeholder="React, JavaScript, CSS (comma separated)"
                value={formData.skillsICanTeach}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skillsIWantToLearn">Skills I Want to Learn</Label>
              <Input
                id="skillsIWantToLearn"
                name="skillsIWantToLearn"
                placeholder="Python, Machine Learning (comma separated)"
                value={formData.skillsIWantToLearn}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
