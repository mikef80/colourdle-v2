import { create } from "zustand";

type State = {
  loginVisible: boolean;
  signupVisible: boolean;
  toggleLogin: () => void;
  toggleSignup: () => void;
};

export const useMenuStore = create<State>((set) => ({
  loginVisible: false,
  signupVisible: false,
  toggleLogin: () => set((state) => ({ loginVisible: !state.loginVisible })),
  toggleSignup: () => set((state) => ({ signupVisible: !state.signupVisible })),
}));
