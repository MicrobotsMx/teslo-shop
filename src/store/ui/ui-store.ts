import { create } from 'zustand'

interface State {
    isSideMenuOpen: boolean;

    openSideMenu: () => void;
    closeSideMneu: () => void;

}

export const useUIStore = create<State>()((set) => ({
    isSideMenuOpen: false,
    openSideMenu: () => set({ isSideMenuOpen: true}),
    closeSideMneu: () => set({ isSideMenuOpen: false}),
}));