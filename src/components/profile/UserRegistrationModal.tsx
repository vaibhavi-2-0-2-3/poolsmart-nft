
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Camera, User, Check, Phone, Mail, Info } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface UserRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (userData: UserProfileData) => void;
  walletAddress: string;
}

export interface UserProfileData {
  username: string;
  fullName: string;
  bio: string;
  avatar: string;
  email: string;
  phone: string;
  walletAddress: string;
}

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  fullName: z.string().min(2, { message: "Full name is required" }),
  bio: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function UserRegistrationModal({ 
  isOpen, 
  onClose, 
  onComplete,
  walletAddress
}: UserRegistrationModalProps) {
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = React.useState("");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullName: "",
      bio: "",
      email: "",
      phone: "",
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

  const onSubmit = (data: FormValues) => {
    // Ensure all required fields are included in the UserProfileData
    const userData: UserProfileData = {
      username: data.username,
      fullName: data.fullName,
      bio: data.bio || "",
      email: data.email,
      phone: data.phone || "",
      avatar: avatarPreview || "",
      walletAddress
    };
    
    onComplete(userData);
    
    toast({
      title: "Profile created!",
      description: "Your profile has been successfully created.",
    });
    
    onClose();
  };

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-brand-100 text-brand-600 text-xl">
                      {getInitials(form.watch("fullName"))}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 rounded-full bg-brand-600 p-2 text-white cursor-pointer"
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
              
              <p className="text-sm text-muted-foreground">
                Click the camera icon to upload a profile picture
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Input {...field} placeholder="John Doe" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <Input {...field} placeholder="johndoe" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input {...field} type="email" placeholder="john@example.com" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input {...field} placeholder="+1 (123) 456-7890" />
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
                  <FormLabel>Bio (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-muted-foreground mt-2" />
                      <Textarea 
                        {...field} 
                        placeholder="Tell us a bit about yourself..."
                        className="min-h-24"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Wallet Address: <span className="font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
              </p>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                <Check className="mr-2 h-4 w-4" />
                Complete Registration
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
