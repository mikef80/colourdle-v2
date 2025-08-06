import { create } from "zustand";
import { useAuth } from "~/utils/auth-context";

type State = {
  loginVisible: boolean;
  signupVisible: boolean;
  toggleLogin: () => void;
  toggleSignup: () => void;
  setLogin: (visibility: boolean) => void;
  setSignup: (visibility: boolean) => void;
};

export const useMenuStore = create<State>((set) => ({
  loginVisible: false,
  signupVisible: false,
  toggleLogin: () => set((state) => ({ loginVisible: !state.loginVisible })),
  toggleSignup: () => set((state) => ({ signupVisible: !state.signupVisible })),
  setLogin: (visibility: boolean) => set(() => ({ loginVisible: visibility })),
  setSignup: (visibility: boolean) => set(() => ({ signupVisible: visibility })),
}));
