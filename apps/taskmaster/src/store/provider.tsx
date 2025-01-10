"use client";

import { create, useStore } from "zustand";
import { createContext, ReactNode, useRef, useContext } from "react";
import { Task, TasksSlice, createTasksSlice } from "./tasks";

// add to args as needed
type AllSlices = TasksSlice; // union slices as needed
export const createAppStore = (startingTasks: Task[]) => {
  return create<AllSlices>()((...a) => ({
    ...createTasksSlice(startingTasks)(...a),
  }));
};

type CreateAppStoreReturn = ReturnType<typeof createAppStore>;
const AppStoreContext = createContext<CreateAppStoreReturn | null>(null);

// we currently instantiate the store in layout of specific pages, rather than root layout
// check best practices; you're supposed to only instantiate a singular store
// this pattern also doesn't work well with the slices pattern
export const AppStoreProvider = ({
  children,
  startingTasks,
}: {
  children: ReactNode;
  startingTasks: Task[];
}) => {
  const storeRef = useRef<CreateAppStoreReturn>();
  if (!storeRef.current) storeRef.current = createAppStore(startingTasks);

  return (
    <AppStoreContext.Provider value={storeRef.current}>
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
