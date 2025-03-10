
import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-insurance-background">
      <Header />
      <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} AutoClaim Assistant - Enterprise Prototype</p>
      </footer>
    </div>
  );
};

export default Layout;
