import { createContext, useContext, useSyncExternalStore } from "react";
import { getState, subscribe } from "./speechEngine";

/** Read-aloud is off unless a lab wraps itself in <TtsProvider> (MK1–MG5 labs). */
export const TtsContext = createContext<{ enabled: boolean }>({ enabled: false });

export const useTtsEnabled = (): boolean => useContext(TtsContext).enabled;

export const useTtsState = () => useSyncExternalStore(subscribe, getState, getState);
