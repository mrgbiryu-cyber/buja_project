// AS-IS: 없음
// TO-BE: 아래 코드 추가
import { create } from 'zustand';

interface UserState {
  points: number;
  personality: any;
  setPoints: (points: number) => void;
  setPersonality: (traits: any) => void;
}

export const useUserStore = create<UserState>((set) => ({
  points: 0,
  personality: null,
  setPoints: (points) => set({ points }),
  setPersonality: (traits) => set({ personality: traits }),
}));