import { create } from "zustand";
import { useAuth } from "~/utils/auth-context";

type State = {
  menuOpen: boolean;
  loginVisible: boolean;
  signupVisible: boolean;
  toggleMenu: () => void;
  toggleLogin: () => void;
  toggleSignup: () => void;
  setLogin: (visibility: boolean) => void;
  setSignup: (visibility: boolean) => void;
};

export const useMenuStore = create<State>((set) => ({
  menuOpen: false,
  loginVisible: false,
  signupVisible: false,
  toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen })),
  toggleLogin: () => set((state) => ({ loginVisible: !state.loginVisible })),
  toggleSignup: () => set((state) => ({ signupVisible: !state.signupVisible })),
  setLogin: (visibility: boolean) => set(() => ({ loginVisible: visibility })),
  setSignup: (visibility: boolean) => set(() => ({ signupVisible: visibility })),
}));
