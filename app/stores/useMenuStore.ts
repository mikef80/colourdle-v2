import { create } from "zustand";
import { useAuth } from "~/utils/auth-context";

type State = {
  loginVisible: boolean;
  signupVisible: boolean;
  // toggleLogin: () => void;
  // toggleSignup: () => void;
};

export const useMenuStore = create<State>((set) => ({
  loginVisible: true,
  signupVisible: true,
  // toggleLogin: () => set((state) => ({ loginVisible: !state.loginVisible })),
  // toggleSignup: () => set((state) => ({ signupVisible: !state.signupVisible })),
}));
