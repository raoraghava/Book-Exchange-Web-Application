import create from 'zustand';

export const useAuthStore = create((set) => ({
    auth: {
        username: localStorage.getItem('username') || '',  // Load username from localStorage
    },
    setUsername: (username) => {
        localStorage.setItem('username', username);  // Also update localStorage when setting username
        set(state => ({ auth: { ...state.auth, username } }));
    }
}));
