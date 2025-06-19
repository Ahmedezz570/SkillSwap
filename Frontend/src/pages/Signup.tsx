
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
    name: '',
    email: '',
    bio: '',
    canTeach: '',
    wantsToLearn: ''
  });
  const { signup, isLoggedIn } = useApp();
  const { toast } = useToast();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      ...formData,
      canTeach: formData.canTeach.split(',').map(skill => skill.trim()).filter(Boolean),
      wantsToLearn: formData.wantsToLearn.split(',').map(skill => skill.trim()).filter(Boolean)
    };
    
    const success = signup(userData);
    if (success) {
      toast({
        title: "Welcome to SkillSwap!",
        description: "Your account has been created successfully.",
      });
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
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
                placeholder="john@example.com"
                value={formData.email}
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
              <Label htmlFor="canTeach">Skills I Can Teach</Label>
              <Input
                id="canTeach"
                name="canTeach"
                placeholder="React, JavaScript, CSS (comma separated)"
                value={formData.canTeach}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wantsToLearn">Skills I Want to Learn</Label>
              <Input
                id="wantsToLearn"
                name="wantsToLearn"
                placeholder="Python, Machine Learning (comma separated)"
                value={formData.wantsToLearn}
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
