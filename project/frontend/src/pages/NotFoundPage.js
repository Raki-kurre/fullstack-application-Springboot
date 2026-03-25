import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
    <p className="text-8xl mb-4">🔍</p>
    <h1 className="text-4xl font-bold text-gray-900">404</h1>
    <p className="text-gray-500 mt-2 mb-6">
      Oops! The page you're looking for doesn't exist.
    </p>
    <Link to="/dashboard" className="btn-primary px-6 py-2.5">
      Back to Dashboard
    </Link>
  </div>
);

export default NotFoundPage;
