
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Camera, User, Save, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getProfile, updateProfile, SupabaseProfile } from "@/lib/supabase";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  bio: z.string().max(500, { message: "Bio must be less than 500 characters" }).optional(),
  search_radius: z.string(),
  luggage_size: z.string(),
  hide_partial_routes: z.boolean(),
  max_back_seat_passengers: z.boolean(),
  music: z.boolean(),
  animals: z.boolean(),
  children: z.boolean(),
  smoking: z.boolean(),
  instagram_handle: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      bio: "",
      search_radius: "10km",
      luggage_size: "medium",
      hide_partial_routes: false,
      max_back_seat_passengers: true,
      music: true,
      animals: false,
      children: true,
      smoking: false,
      instagram_handle: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    try {
      setInitialLoading(true);
      const profile = await getProfile();
      if (profile) {
        form.reset({
          username: profile.username || "",
          bio: profile.bio || "",
          search_radius: profile.search_radius || "10km",
          luggage_size: profile.luggage_size || "medium",
          hide_partial_routes: profile.hide_partial_routes || false,
          max_back_seat_passengers: profile.max_back_seat_passengers !== false,
          music: profile.music !== false,
          animals: profile.animals || false,
          children: profile.children !== false,
          smoking: profile.smoking || false,
          instagram_handle: profile.instagram_handle || "",
        });
        setAvatarPreview(profile.avatar_url || "");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    } finally {
      setInitialLoading(false);
    }
  };

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

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      await updateProfile({
        username: data.username,
        bio: data.bio || null,
        avatar_url: avatarPreview || null,
        search_radius: data.search_radius,
        luggage_size: data.luggage_size,
        hide_partial_routes: data.hide_partial_routes,
        max_back_seat_passengers: data.max_back_seat_passengers,
        music: data.music,
        animals: data.animals,
        children: data.children,
        smoking: data.smoking,
        instagram_handle: data.instagram_handle || null,
      });
      
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
      
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  if (initialLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-brand-100 text-brand-600 text-xl">
                      {getInitials(form.watch("username") || "U")}
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
                Click the camera icon to upload a new profile picture
              </p>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter username" />
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
                      <Textarea {...field} placeholder="Tell us about yourself..." rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram_handle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram Handle (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="@yourusername" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Search & Ride Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Search & Ride Preferences</h3>
              
              <FormField
                control={form.control}
                name="search_radius"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search Radius</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select search radius" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5km">5 km</SelectItem>
                        <SelectItem value="10km">10 km</SelectItem>
                        <SelectItem value="25km">25 km</SelectItem>
                        <SelectItem value="50km">50 km</SelectItem>
                        <SelectItem value="100km">100 km</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="luggage_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Luggage Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select luggage size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hide_partial_routes"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Hide partial routes</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Only show rides that match your exact route
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_back_seat_passengers"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Max 2 people in back seat</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Prefer rides with maximum 2 passengers in back
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Personal Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Preferences</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="music"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Music</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="animals"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Animals</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="children"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Children</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smoking"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Smoking</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
