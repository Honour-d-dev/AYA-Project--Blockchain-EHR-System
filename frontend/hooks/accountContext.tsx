"use client";

import { useAlchemyProvider } from "@/hooks/useAlchemyProvider";
import type { AlchemyProvider } from "@alchemy/aa-alchemy";
import { useMagicSigner } from "@/hooks/useMagic";
import { Address, type PublicClient, createPublicClient, custom } from "viem";
import { createContext, useState, PropsWithChildren, useEffect, useCallback, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { HealthRecordManagerAddress, chain, users } from "@/lib/constants";
import { useW3, type Client } from "@/hooks/useW3";
import * as Delegation from "@ucanto/core/delegation";
import { delegate } from "@/server/w3up-client";
import { HealthRecordManagerV2Abi } from "@/abis/HeahthRecordManagerV2abi";

//type Client = ReturnType<typeof useW3>[0]["client"];

interface TAccountContext {
  login: (email: string) => Promise<void>;
  loginExistingUser: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  // Properties
  smartClient: AlchemyProvider;
  magicClient?: PublicClient;
  ownerAddress?: Address;
  scaAddress?: Address;
  email?: string;
  isLoggedIn: boolean;
}

export const AccountContext = createContext({} as TAccountContext);

export const AccountProvider = ({ children }: PropsWithChildren) => {
  const { magic, signer } = useMagicSigner();
  const { smartClient, connectClientToAccount, disconnectClientFromAccount } = useAlchemyProvider();
  const [{ client }] = useW3();
  const [ownerAddress, setOwnerAddress] = useState<Address>();
  const [scaAddress, setScaAddress] = useState<Address>();
  const [email, setEmail] = useState<string>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const magicClient = useMemo(() => {
    if (magic) {
      console.log("magicClient init");
      return createPublicClient({
        transport: custom(magic.rpcProvider),
        chain,
      });
    }
  }, [magic]);
  const router = useRouter();

  const loginExistingUser = useCallback(
    async (email: string) => {
      if (!magic || !magic.user || !signer || !magicClient) {
        throw new Error("Magic not initialized");
      }
      const isLoggedIn = await magic.user.isLoggedIn();
      if (!isLoggedIn) {
        await magic.auth.loginWithEmailOTP({
          email,
          showUI: true,
        });
        /**might chexk for device change */
      }

      const metadata = await magic.user.getInfo();
      if (!metadata.publicAddress || !metadata.email) {
        throw new Error("Magic login failed");
      }

      const userInfo = await magicClient.readContract({
        account: metadata.publicAddress as Address,
        abi: HealthRecordManagerV2Abi,
        address: HealthRecordManagerAddress,
        functionName: "gerUserInfo",
        args: [metadata.email],
      });

      setIsLoggedIn(true);
      connectClientToAccount(signer, userInfo.owner);
      setEmail(metadata.email);
      setOwnerAddress(metadata.publicAddress as Address);
      setScaAddress(userInfo.owner);

      router.push(`/${users[userInfo.userType]}?cid=${userInfo.cid}`);
    },
    [magic, magicClient, signer],
  );

  const login = useCallback(
    async (email: string) => {
      if (!magic || !magic.user || !signer) {
        throw new Error("Magic not initialized");
      }

      const didToken = await magic.auth.loginWithEmailOTP({
        email,
        showUI: true,
      });
      const metadata = await magic.user.getInfo();
      if (!didToken || !metadata.publicAddress || !metadata.email) {
        throw new Error("Magic login failed");
      }
      console.log(metadata);

      setIsLoggedIn(true);
      const connectedClient = connectClientToAccount(signer);
      setEmail(metadata.email);
      setOwnerAddress(metadata.publicAddress as Address);
      setScaAddress(await connectedClient.getAddress());
    },
    [magic, connectClientToAccount, signer],
  );

  const logout = useCallback(async () => {
    if (!magic || !magic.user) {
      throw new Error("Magic not initialized");
    }
    console.log("logging out...");

    const handle = magic.user.logout();

    handle
      .on("done", (done) => {
        setIsLoggedIn(false);
        disconnectClientFromAccount();
        setEmail(undefined);
        setOwnerAddress(undefined);
        setScaAddress(undefined);
        console.log(`logged out is ${done}`);
      })
      .on("error", (e) => {
        console.log(e);
      });
  }, [magic, disconnectClientFromAccount]);

  useEffect(() => {
    async function fetchData() {
      if (!magic || !magic.user || !signer || !magicClient) {
        throw new Error("Magic not initialized");
      }

      const isLoggedIn = await magic.user.isLoggedIn();

      if (!isLoggedIn) {
        return;
      }

      console.log("running effect");
      const metadata = await magic.user.getInfo();
      if (!metadata.publicAddress || !metadata.email) {
        throw new Error("Magic login failed");
      }

      const userInfo = await magicClient.readContract({
        account: metadata.publicAddress as Address,
        abi: HealthRecordManagerV2Abi,
        address: HealthRecordManagerAddress,
        functionName: "gerUserInfo",
        args: [metadata.email],
      });

      setIsLoggedIn(isLoggedIn);
      const connectedClient = connectClientToAccount(signer, userInfo.owner);
      setEmail(metadata.email);
      setOwnerAddress(metadata.publicAddress as Address);
      setScaAddress(await connectedClient.getAddress());
    }

    fetchData();
    /**ideally this should only run once(on start up) if the user is logged in
     * and triger the go to profile button on the homepage when fetchdata is done
     */
  }, [magicClient, connectClientToAccount]);

  useEffect(() => {
    async function loadClient() {
      if (client) {
        /**Recieving a delegation to the shared space from the server */
        const proof = await delegate(client.agent.did());

        if (proof.data) {
          const delegation = await Delegation.extract(new Uint8Array(proof.data));
          if (delegation.ok) {
            console.log(delegation);
            const space = await client.addSpace(delegation.ok);
            await client.setCurrentSpace(space.did());
            console.log(client.currentSpace());
          }
        }
      }
    }

    loadClient();
  }, [client]);

  return (
    <AccountContext.Provider
      value={{
        login,
        loginExistingUser,
        logout,
        scaAddress,
        ownerAddress,
        smartClient,
        magicClient,
        isLoggedIn,
        email,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
