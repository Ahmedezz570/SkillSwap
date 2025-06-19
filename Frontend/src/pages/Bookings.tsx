
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Plus, Star } from 'lucide-react';

const Bookings = () => {
  const { currentUser, users, bookings, addBooking, rateUser } = useApp();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [ratingModalOpen, setRatingModalOpen] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const { toast } = useToast();

  if (!currentUser) return null;

  const myBookings = bookings.filter(booking => 
    booking.teacherId === currentUser.id || booking.studentId === currentUser.id
  );

  const availableTeachers = users.filter(user => 
    user.id !== currentUser.id &&
    user.canTeach.some(skill => currentUser.wantsToLearn.includes(skill))
  );

  const availableSkills = selectedTeacher ? 
    users.find(u => u.id === selectedTeacher)?.canTeach.filter(skill => 
      currentUser.wantsToLearn.includes(skill)
    ) || [] : [];

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleBookSession = () => {
    if (!selectedTeacher || !selectedSkill || !selectedDate || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all booking details.",
        variant: "destructive",
      });
      return;
    }

    addBooking({
      teacherId: selectedTeacher,
      studentId: currentUser.id,
      skill: selectedSkill,
      date: selectedDate,
      time: selectedTime,
      status: 'pending'
    });

    toast({
      title: "Session booked!",
      description: "Your skill swap session has been scheduled.",
    });

    setIsBookingModalOpen(false);
    setSelectedTeacher('');
    setSelectedSkill('');
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleRateUser = (userId: string) => {
    rateUser(userId, rating);
    toast({
      title: "Rating submitted!",
      description: "Thank you for your feedback.",
    });
    setRatingModalOpen(null);
    setRating(5);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">Manage your skill swap sessions.</p>
        </div>
        
        <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Book Session</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book a Skill Swap Session</DialogTitle>
              <DialogDescription>
                Schedule a learning session with one of your matches.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="teacher">Select Teacher</Label>
                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeachers.map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedTeacher && (
                <div>
                  <Label htmlFor="skill">Select Skill</Label>
                  <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSkills.map(skill => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <Label htmlFor="time">Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleBookSession} className="w-full">
                Book Session
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {myBookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No bookings yet. Book your first skill swap session!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {myBookings.map(booking => {
            const isTeacher = booking.teacherId === currentUser.id;
            const otherUser = users.find(u => u.id === (isTeacher ? booking.studentId : booking.teacherId));
            
            return (
              <Card key={booking.id} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={otherUser?.avatar} />
                        <AvatarFallback>{otherUser?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {isTeacher ? 'Teaching' : 'Learning'} {booking.skill}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {isTeacher ? 'Student' : 'Teacher'}: {otherUser?.name}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>{booking.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      
                      {booking.status === 'completed' && !isTeacher && (
                        <Dialog open={ratingModalOpen === booking.id} onOpenChange={(open) => setRatingModalOpen(open ? booking.id : null)}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Star className="h-4 w-4 mr-1" />
                              Rate
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Rate your teacher</DialogTitle>
                              <DialogDescription>
                                How was your session with {otherUser?.name}?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Rating (1-5)</Label>
                                <Select value={rating.toString()} onValueChange={(value) => setRating(Number(value))}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[1, 2, 3, 4, 5].map(num => (
                                      <SelectItem key={num} value={num.toString()}>
                                        {num} Star{num !== 1 ? 's' : ''}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button onClick={() => handleRateUser(otherUser?.id || '')} className="w-full">
                                Submit Rating
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Bookings;
