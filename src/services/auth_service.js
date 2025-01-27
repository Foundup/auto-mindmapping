import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

class AuthService {
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  getCurrentUser() {
    return auth.currentUser;
  }

  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  }
}

export const authService = new AuthService(); 