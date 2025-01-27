const DEFAULT_TOKEN_QUOTA = 5000;

class UserService {
  constructor() {
    this.loadUserData();
  }

  loadUserData() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.userData = JSON.parse(userData);
    } else {
      this.userData = {
        tokenQuota: DEFAULT_TOKEN_QUOTA,
        usedTokens: 0,
      };
      this.saveUserData();
    }
  }

  saveUserData() {
    localStorage.setItem('userData', JSON.stringify(this.userData));
  }

  getUserData() {
    return { ...this.userData };
  }

  deductTokens(amount) {
    if (this.userData.tokenQuota - this.userData.usedTokens < amount) {
      throw new Error('Insufficient token quota');
    }
    this.userData.usedTokens += amount;
    this.saveUserData();
  }

  addTokens(amount) {
    this.userData.tokenQuota += amount;
    this.saveUserData();
  }

  getRemainingTokens() {
    return this.userData.tokenQuota - this.userData.usedTokens;
  }

  resetQuota() {
    this.userData.tokenQuota = DEFAULT_TOKEN_QUOTA;
    this.userData.usedTokens = 0;
    this.saveUserData();
  }
}

export const userService = new UserService(); 