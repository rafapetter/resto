import "server-only";

import { cache } from "react";
import { createCaller } from "@/server/trpc/router";
import { createContext } from "@/server/trpc/init";
import { makeQueryClient } from "./query-client";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createCaller(createContext);
