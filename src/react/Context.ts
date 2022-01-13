import { createContext } from "react";

import type { Store } from "../index";

export const StoreContext = createContext<Store<any, any> | null>(null);
