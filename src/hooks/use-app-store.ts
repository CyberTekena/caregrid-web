"use client"

import { useSyncExternalStore } from "react"
import { appStore, type AppState } from "@/store/app-store"

export function useAppStore(): AppState {
  return useSyncExternalStore(
    appStore.subscribe,
    appStore.getState,
    appStore.getState
  )
}
