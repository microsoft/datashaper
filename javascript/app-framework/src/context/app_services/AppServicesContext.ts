import { createContext } from "react"
import type { AppServices } from "../../types.js"

export const AppServicesContext = createContext<AppServices>(null as any)