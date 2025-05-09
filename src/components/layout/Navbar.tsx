
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../shared/Button";
import { WalletConnect } from "../wallet/WalletConnect";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { WalletDropdown } from "../wallet/WalletDropdown";
import { useWeb3 } from "@/hooks/useWeb3";

export function Navbar() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { address } = useWeb3();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Rides", path: "/rides" },
    { name: "Events", path: "/events" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "DAO", path: "/dao-governance" },
    { name: "Docs", path: "/documentation" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path ? "text-brand-600" : "text-foreground";
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
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
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

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
                <div className="mt-6">
                  {address ? (
                    <WalletDropdown
                      address={address || ''}
                      balance={'0.00'}
                      userProfile={null}
                      onDisconnect={() => {}}
                      onCopyAddress={() => {}}
                    />
                  ) : (
                    <WalletConnect />
                  )}
                </div>
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
            <div className="pl-6 border-l border-border">
              {address ? <WalletDropdown
                address={address || ''}
                balance={'0.00'}
                userProfile={null}
                onDisconnect={() => {}}
                onCopyAddress={() => {}}
              /> : <WalletConnect />}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
