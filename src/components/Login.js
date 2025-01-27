import React from 'react';
import { authService } from '../services/auth_service';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../services/firebase';

export function Login() {
  const [user, loading, error] = useAuthState(auth);

  const handleGoogleSignIn = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="login-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="login-container">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="login-container">
      {user ? (
        <div className="user-info">
          <img 
            src={user.photoURL} 
            alt={user.displayName} 
            className="user-avatar"
          />
          <div className="user-details">
            <p className="user-name">{user.displayName}</p>
            <p className="user-email">{user.email}</p>
            <button 
              onClick={handleSignOut}
              className="sign-out-btn"
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={handleGoogleSignIn}
          className="google-sign-in-btn"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
} 