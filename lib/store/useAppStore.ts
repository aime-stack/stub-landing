import { create } from 'zustand';

interface User {
  id: string;
  email: string | null;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    username?: string;
    verified?: boolean;
    [key: string]: any;
  };
}

interface AppState {
  user: User | null;
  walletBalance: number;
  theme: 'dark' | 'light';
  isInitializing: boolean;
  setUser: (user: User | null) => void;
  setWalletBalance: (balance: number) => void;
  incrementWalletBalance: (amount: number) => void;
  decrementWalletBalance: (amount: number) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setInitializing: (isInit: boolean) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  user: null,
  walletBalance: 0,
  theme: 'dark', // Default to dark as per SnapGram design
  isInitializing: true,
  
  setUser: (user) => set({ user }),
  
  setWalletBalance: (balance) => set({ walletBalance: balance }),
  
  incrementWalletBalance: (amount) => 
    set((state) => ({ walletBalance: state.walletBalance + amount })),
    
  decrementWalletBalance: (amount) => 
    set((state) => ({ walletBalance: Math.max(0, state.walletBalance - amount) })),
    
  toggleTheme: () => 
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    
  setTheme: (theme) => set({ theme }),
  
  setInitializing: (isInit) => set({ isInitializing: isInit }),
}));
