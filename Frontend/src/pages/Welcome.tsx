
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageCircle, Calendar, Star, Heart, Shield, Globe } from 'lucide-react';

const Welcome = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to SkillSwap
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Connect with like-minded learners and teachers. Share your skills, learn new ones, and grow together in a collaborative community.
            </p>
            <div className="space-x-4">
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About SkillSwap
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SkillSwap is a revolutionary platform that connects people who want to learn with those who want to teach. 
              Our mission is to democratize education and create a global community of lifelong learners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center hover-lift">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Community First</CardTitle>
                <CardDescription>
                  Built on the belief that everyone has something valuable to teach and learn
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover-lift">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Safe & Secure</CardTitle>
                <CardDescription>
                  Verified users, secure messaging, and trusted rating system for peace of mind
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover-lift">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Global Reach</CardTitle>
                <CardDescription>
                  Connect with learners and teachers from around the world, breaking geographical barriers
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How SkillSwap Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple three-step process to start learning and teaching
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover-lift">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Find Matches</CardTitle>
                <CardDescription>
                  Discover people who can teach what you want to learn, and vice versa
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover-lift">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Connect & Chat</CardTitle>
                <CardDescription>
                  Start conversations and plan your skill exchange sessions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover-lift">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Book Sessions</CardTitle>
                <CardDescription>
                  Schedule convenient times for your learning and teaching sessions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover-lift">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Rate & Review</CardTitle>
                <CardDescription>
                  Provide feedback to help build a trusted learning community
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Active Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-gray-600">Different Skills</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-gray-600">Sessions Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community today and start your skill swapping journey!
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              Join SkillSwap Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
