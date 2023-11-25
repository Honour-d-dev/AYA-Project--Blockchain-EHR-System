"use client";

import { useAlchemyProvider } from "@/hooks/useAlchemyProvider";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { useMagicSigner } from "@/hooks/useMagic";
import { Address, PublicClient, createPublicClient, custom } from "viem";
import {
  createContext,
  useState,
  PropsWithChildren,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { HealthRecordManagerAbi } from "@/abis/HealthRecordManager";
import { HealthRecordManagerAddress, chain, users } from "@/utils/constants";
import { useKeyring } from "@/hooks/useKeyring";
//import * as Delegation from "@ucanto/core/delegation";
//import { delegate } from "@/server/w3up-client";

type Client = ReturnType<typeof useKeyring>[0]["client"];

interface TAccountContext {
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  // Properties
  smartClient: AlchemyProvider;
  magicClient?: PublicClient;
  ownerAddress?: Address;
  scaAddress?: Address;
  username?: string;
  isLoggedIn: boolean;
}

export const AccountContext = createContext({} as TAccountContext);

export const AccountProvider = ({ children }: PropsWithChildren) => {
  const { magic, signer } = useMagicSigner();
  const { smartClient, connectClientToAccount, disconnectClientFromAccount } =
    useAlchemyProvider();
  const [, { loadAgent }] = useKeyring();
  const [ownerAddress, setOwnerAddress] = useState<Address>();
  const [scaAddress, setScaAddress] = useState<Address>();
  const [username, setUsername] = useState<string>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const magicClient = useMemo(() => {
    if (magic) {
      console.log("magicClient init");
      return createPublicClient({
        transport: custom(magic.rpcProvider),
        chain,
        batch: {
          multicall: true,
        },
      });
    }
  }, [magic]);
  const router = useRouter();

  const login = useCallback(
    async (email: string) => {
      if (!magic || !magic.user || !signer) {
        throw new Error("Magic not initialized");
      }

      const didToken = await magic.auth.loginWithMagicLink({
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
      setUsername(metadata.email);
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

    console.log(!(await magic.user.isLoggedIn()));
    let a = magic.user.logout();
    a.on("done", (done) => {
      console.log(done);
      setIsLoggedIn(false);
      disconnectClientFromAccount();
      setUsername(undefined);
      setOwnerAddress(undefined);
      setScaAddress(undefined);
      console.log("logged out");
    }).on("error", (e) => {
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

      await loadAgent();

      // const space = client?.spaces().find((space) => space.name === "Honour");
      // if (!space && client) {
      // let proof = await fetch(
      //   `http://localhost:3000/api/w3up-client/${client.did()}`,
      // );
      // const proof = await delegate(client.did());
      // console.log(proof);
      // const space = await ipfsClient.addSpace(proof);
      // await ipfsClient.setCurrentSpace(space.did());
      //}

      const [cid, type] = await Promise.all([
        magicClient.readContract({
          abi: HealthRecordManagerAbi,
          address: HealthRecordManagerAddress,
          functionName: "getHealthRecord",
        }),
        magicClient.readContract({
          abi: HealthRecordManagerAbi,
          address: HealthRecordManagerAddress,
          functionName: "gerUserType",
          args: [metadata.email],
        }),
      ]);

      setIsLoggedIn(isLoggedIn);
      const connectedClient = connectClientToAccount(signer);
      setUsername(metadata.email);
      setOwnerAddress(metadata.publicAddress as Address);
      setScaAddress(await connectedClient.getAddress());

      //router.push(`/${users[type]}`);
    }
    fetchData();
  }, [magicClient, connectClientToAccount]);

  return (
    <AccountContext.Provider
      value={{
        login,
        logout,
        scaAddress,
        ownerAddress,
        smartClient,
        magicClient,
        isLoggedIn,
        username,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
