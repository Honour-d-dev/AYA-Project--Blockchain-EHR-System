import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import "dotenv/config";

export const env = createEnv({
  server: {
    PROOF: z.string(),
    DID_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_MAGIC_API_KEY: z.string(),
    NEXT_PUBLIC_ALCHEMY_API_KEY: z.string(),
  },
  runtimeEnv: {
    PROOF: process.env.PROOF,
    DID_KEY: process.env.DID_KEY,
    NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    NEXT_PUBLIC_MAGIC_API_KEY: process.env.NEXT_PUBLIC_MAGIC_API_KEY,
  },
});
