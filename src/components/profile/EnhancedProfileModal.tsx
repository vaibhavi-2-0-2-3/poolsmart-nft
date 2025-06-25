
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Camera, User, Check, MapPin, Luggage } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/shared/Card";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface EnhancedProfileData {
  username: string;
  avatar: string;
  bio: string;
  preferences: {
    searchRadius: string;
    luggageSize: string;
    hidePartialRoutes: boolean;
    maxBackSeatPassengers: boolean;
    music: boolean;
    animals: boolean;
    children: boolean;
    smoking: boolean;
  };
}

interface EnhancedProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: EnhancedProfileData;
  onSave: (data: EnhancedProfileData) => void;
}

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  bio: z.string().max(200, { message: "Bio must be less than 200 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export function EnhancedProfileModal({ 
  isOpen, 
  onClose, 
  currentData,
  onSave 
}: EnhancedProfileModalProps) {
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState(currentData.avatar);
  const [preferences, setPreferences] = useState(currentData.preferences);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: currentData.username,
      bio: currentData.bio || "",
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePreference = (key: keyof typeof preferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const onSubmit = (data: FormValues) => {
    onSave({
      username: data.username,
      avatar: avatarPreview,
      bio: data.bio,
      preferences,
    });
    
    toast({
      title: "Profile updated!",
      description: "Your premium profile has been successfully updated.",
    });
    
    onClose();
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Premium Profile</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture & Basic Info */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              
              <div className="flex flex-col items-center justify-center space-y-4 mb-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt="Profile" />
                    ) : (
                      <AvatarFallback className="bg-brand-100 text-brand-600 text-xl">
                        {getInitials(currentData.username)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute bottom-0 right-0 rounded-full bg-brand-600 p-2 text-white cursor-pointer hover:bg-brand-700 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                
                <p className="text-sm text-muted-foreground text-center">
                  Upload a profile picture to help other carpoolers recognize you
                </p>
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <Input {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Tell other carpoolers about yourself..." 
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Search & Ride Preferences */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Search & Ride Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Search Radius
                  </label>
                  <Select value={preferences.searchRadius} onValueChange={(value) => updatePreference('searchRadius', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5km">5 km</SelectItem>
                      <SelectItem value="10km">10 km</SelectItem>
                      <SelectItem value="25km">25 km</SelectItem>
                      <SelectItem value="50km">50 km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Luggage className="h-4 w-4 inline mr-1" />
                    Luggage Size
                  </label>
                  <Select value={preferences.luggageSize} onValueChange={(value) => updatePreference('luggageSize', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Hide partial routes</label>
                  <Switch 
                    checked={preferences.hidePartialRoutes}
                    onCheckedChange={(checked) => updatePreference('hidePartialRoutes', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Max 2 people in back seat</label>
                  <Switch 
                    checked={preferences.maxBackSeatPassengers}
                    onCheckedChange={(checked) => updatePreference('maxBackSeatPassengers', checked)}
                  />
                </div>
              </div>
            </Card>

            {/* Personal Preferences */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Personal Preferences</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Music</label>
                  <Switch 
                    checked={preferences.music}
                    onCheckedChange={(checked) => updatePreference('music', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Animals</label>
                  <Switch 
                    checked={preferences.animals}
                    onCheckedChange={(checked) => updatePreference('animals', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Children</label>
                  <Switch 
                    checked={preferences.children}
                    onCheckedChange={(checked) => updatePreference('children', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Smoking</label>
                  <Switch 
                    checked={preferences.smoking}
                    onCheckedChange={(checked) => updatePreference('smoking', checked)}
                  />
                </div>
              </div>
            </Card>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                <Check className="mr-2 h-4 w-4" />
                Save Premium Profile
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
