
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../shared/Button";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "../auth/AuthModal";
import { ProfileSettingsModal } from "../profile/ProfileSettingsModal";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getProfile, SupabaseProfile } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [profile, setProfile] = useState<SupabaseProfile | null>(null);
  const location = useLocation();
  const { user, signOut, loading } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Rides", path: "/rides" },
    { name: "Events", path: "/events" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "DAO", path: "/dao-governance" },
    { name: "Docs", path: "/documentation" },
  ];

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const profileData = await getProfile();
      setProfile(profileData);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-brand-600" : "text-foreground";
  };

  const closeMenu = () => setIsMenuOpen(false);

  const getDisplayName = () => {
    if (profile?.username) return profile.username;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-10 w-full backdrop-blur-sm bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gradient-to-r from-brand-500 to-brand-700 p-1 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">RP</span>
              </div>
              <div>
                <span className="text-xl font-bold">RidePool</span>
                <div className="text-xs text-muted-foreground">Decentralized Carpooling</div>
              </div>
            </Link>
          </div>

          {isMobile ? (
            <>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-1">
                        <Avatar className="h-8 w-8">
                          {profile?.avatar_url ? (
                            <AvatarImage src={profile.avatar_url} alt="Profile" />
                          ) : (
                            <AvatarFallback className="bg-brand-100 text-brand-600">
                              {getInitials()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background border">
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowProfileSettings(true)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAuthModal(true)}
                    disabled={loading}
                  >
                    Sign In
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>

              {isMenuOpen && (
                <div className="fixed inset-0 top-16 z-50 bg-background/95 p-6 flex flex-col gap-4 border-t animate-in fade-in slide-in-from-top">
                  <nav className="space-y-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`block text-lg font-medium ${isActive(
                          link.path
                        )}`}
                        onClick={closeMenu}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-6">
              <nav className="flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-colors hover:text-brand-900 ${isActive(
                      link.path
                    )}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="pl-6 border-l border-border flex items-center gap-4">
                <ThemeToggle />
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Avatar className="h-6 w-6">
                          {profile?.avatar_url ? (
                            <AvatarImage src={profile.avatar_url} alt="Profile" />
                          ) : (
                            <AvatarFallback className="bg-brand-100 text-brand-600 text-xs">
                              {getInitials()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <span className="text-sm">{getDisplayName()}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background border">
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowProfileSettings(true)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAuthModal(true)}
                    disabled={loading}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <ProfileSettingsModal
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
      />
    </>
  );
}
