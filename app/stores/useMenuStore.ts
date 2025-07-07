import { create } from "zustand";

type State = {
  loginSignupVisible: boolean;
  toggleLoginSignup: () => void;
};

export const useMenuStore = create<State>((set) => ({
  loginSignupVisible: false,
  toggleLoginSignup: () => set((state) => ({ loginSignupVisible: !state.loginSignupVisible })),
}));
