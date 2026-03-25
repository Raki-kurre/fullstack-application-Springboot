import React from 'react';
import Navbar from './Navbar';

const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
    <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} ShopApp. Built with React + Spring Boot.
    </footer>
  </div>
);

export default MainLayout;
