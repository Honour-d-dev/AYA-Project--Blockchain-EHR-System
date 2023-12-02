import { WalletClientSigner, type SmartAccountSigner } from "@alchemy/aa-core";
import { Magic } from "magic-sdk";
import { createWalletClient, custom } from "viem";
import "dotenv/config";
import { chain } from "@/lib/constants";
import { useMemo } from "react";

export const useMagicSigner = () => {
  if (typeof window === "undefined") {
    return { magic: null, signer: null };
  }

  const magicApiKey = process.env.NEXT_PUBLIC_MAGIC_API_KEY!; //temp
  const magic = new Magic(magicApiKey, { network: "sepolia" });

  const magicWalletClient = createWalletClient({
    transport: custom(magic.rpcProvider),
    chain,
  });

  const magicSigner: SmartAccountSigner = new WalletClientSigner(magicWalletClient, "magic");

  return useMemo(() => {
    return { magic, signer: magicSigner };
  }, []);
};
