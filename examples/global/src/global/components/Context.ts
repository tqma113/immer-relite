import { createContext } from "react";

import type { Storage } from "../store";

export const StorageContext = createContext<Storage | null>(null);
