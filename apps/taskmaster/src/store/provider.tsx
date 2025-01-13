"use client";

import { create, useStore } from "zustand";
import { createContext, ReactNode, useRef, useContext } from "react";
import { TasksSlice, createTasksSlice } from "./tasks";
import type { TaskObject } from "./tasks.types";

// add to args as needed
type AllSlices = TasksSlice; // union slices as needed
export const createAppStore = () => {
  return create<AllSlices>()((...a) => ({
    ...createTasksSlice()(...a),
  }));
};

type CreateAppStoreReturn = ReturnType<typeof createAppStore>;
const AppStoreContext = createContext<CreateAppStoreReturn | null>(null);

// we currently instantiate the store in layout of specific pages, rather than root layout
// check best practices; you're supposed to only instantiate a singular store
// this pattern also doesn't work well with the slices pattern
interface AppStoreProviderProps {
  children: ReactNode;
}
export const AppStoreProvider = ({ children }: AppStoreProviderProps) => {
  // Use a stable reference for the store, ensuring it's created only once
  const store = useRef(createAppStore()).current;
  return (
    <AppStoreContext.Provider value={store}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = <T,>(selector: (store: AllSlices) => T): T => {
  const appStoreContext = useContext(AppStoreContext);

  if (!appStoreContext) {
    throw new Error(`useAppStore must be use within AppStoreProvider`);
  }

  return useStore(appStoreContext, selector);
};
