import { WalletClientSigner, type SmartAccountSigner } from "@alchemy/aa-core";
import { Magic } from "magic-sdk";
import { createWalletClient, custom } from "viem";
import { chain } from "@/lib/constants";
import { useMemo } from "react";
import { env } from "@/env/env.mjs";

export const useMagicSigner = () => {
  if (typeof window === "undefined") {
    return { magic: null, signer: null };
  }

  const magic = new Magic(env.NEXT_PUBLIC_MAGIC_API_KEY, { network: "sepolia" });

  const magicWalletClient = createWalletClient({
    transport: custom(magic.rpcProvider),
    chain,
  });

  const magicSigner: SmartAccountSigner = new WalletClientSigner(magicWalletClient, "magic");

  return useMemo(() => {
    return { magic, signer: magicSigner };
  }, []);
};
