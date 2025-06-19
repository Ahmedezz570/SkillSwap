
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Star, Search, MessageCircle } from 'lucide-react';

const Matches = () => {
  const { currentUser, users, sendMessage } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  if (!currentUser) return null;

  const calculateMatchScore = (user: any) => {
    let score = 0;
    const canTeachMatch = user.canTeach.filter(skill => 
      currentUser.wantsToLearn.includes(skill)
    ).length;
    const wantsToLearnMatch = user.wantsToLearn.filter(skill => 
      currentUser.canTeach.includes(skill)
    ).length;
    
    score = canTeachMatch + wantsToLearnMatch;
    return { score, canTeachMatch, wantsToLearnMatch };
  };

  const potentialMatches = users
    .filter(user => user.id !== currentUser.id)
    .map(user => ({ ...user, ...calculateMatchScore(user) }))
    .filter(user => 
      user.score > 0 && 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.score - a.score);

  const handleStartConversation = (user: any) => {
    const matchedSkills = [
      ...user.canTeach.filter(skill => currentUser.wantsToLearn.includes(skill)),
      ...user.wantsToLearn.filter(skill => currentUser.canTeach.includes(skill))
    ];
    
    const message = `Hi ${user.name}! I saw we have matching skills: ${matchedSkills.join(', ')}. Would you be interested in a skill swap?`;
    sendMessage(user.id, message);
    
    toast({
      title: "Message sent!",
      description: `You've started a conversation with ${user.name}.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Match</h1>
        <p className="text-gray-600 mb-6">Discover people who can teach you what you want to learn, and who want to learn what you can teach.</p>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {potentialMatches.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">No matches found. Try updating your skills or search term.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {potentialMatches.map(user => (
            <Card key={user.id} className="hover-lift animate-fade-in">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{user.rating.toFixed(1)}</span>
                      <span className="text-sm text-gray-400">({user.sessionsCompleted} sessions)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{user.bio}</p>
                
                {user.canTeachMatch > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-green-700 mb-2">Can teach you:</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.canTeach
                        .filter(skill => currentUser.wantsToLearn.includes(skill))
                        .map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs bg-green-100 text-green-700">
                            {skill}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
                
                {user.wantsToLearnMatch > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-blue-700 mb-2">Wants to learn from you:</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.wantsToLearn
                        .filter(skill => currentUser.canTeach.includes(skill))
                        .map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs border-blue-200 text-blue-700">
                            {skill}
                          </Badge>
                        ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium text-primary">
                    {user.score} skill{user.score !== 1 ? 's' : ''} match
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleStartConversation(user)}
                    className="flex items-center space-x-1"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Connect</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
