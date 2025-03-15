
import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface DocumentLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const DocumentLayout = ({ children, title, description }: DocumentLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            {description && (
              <p className="text-muted-foreground mb-8">{description}</p>
            )}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export { DocumentLayout };
