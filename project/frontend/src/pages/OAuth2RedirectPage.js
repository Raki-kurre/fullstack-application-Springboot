import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import Spinner from '../components/common/Spinner';

/**
 * Landing page after Google OAuth2 success.
 * Spring Boot redirects here with ?token=<JWT>
 * We store the token, fetch the user profile, then send to dashboard.
 */
const OAuth2RedirectPage = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google login failed: ' + error);
      navigate('/login');
      return;
    }

    if (!token) {
      toast.error('No token received from OAuth2 provider');
      navigate('/login');
      return;
    }

    // Temporarily store token so the API interceptor can attach it
    localStorage.setItem('token', token);

    // Fetch user profile using the new token
    authService.getProfile()
      .then(user => {
        login({ accessToken: token, user });
        toast.success(`Welcome, ${user.name}! 🎉`);
        navigate('/dashboard');
      })
      .catch(() => {
        localStorage.removeItem('token');
        toast.error('Failed to load user info after Google login');
        navigate('/login');
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Spinner size="lg" />
      <p className="text-gray-500 mt-4 text-sm">Completing Google sign-in…</p>
    </div>
  );
};

export default OAuth2RedirectPage;
