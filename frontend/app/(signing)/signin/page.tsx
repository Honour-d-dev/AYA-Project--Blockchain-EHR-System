"use client";
import {
  HDAccount,
  WalletClient,
  createWalletClient,
  http,
  publicActions,
} from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { LoginmanagerAbi } from "@/abis/LoginManagerAbi";
import { useContext, useRef, useState } from "react";
import { encrypt } from "@metamask/browser-passworder";
import { AccountContext } from "@/components/context/accountContext";
import { users } from "../../user-types";
import { useRouter } from "next/navigation";

type TAccountDetails = {
  seedPhrase: string;
  account: HDAccount;
  client: WalletClient;
  usertype: string;
};

export default function Signin() {
  const [error, setError] = useState<string>();
  const [stage, setStage] = useState<1 | 2>(1);
  const { setAccount } = useContext(AccountContext);

  const router = useRouter();

  const accountDetails = useRef({} as TAccountDetails);

  const getAccount = async () => {
    try {
      const seedPhrase = (
        document.getElementById("seed") as HTMLInputElement
      ).value
        .split(" ")
        .filter((word) => word !== "")
        .reduce((acc, str) => acc.concat(" ", str)); //refactoring incase of multiple spaces

      const account = mnemonicToAccount(seedPhrase);

      const client = createWalletClient({
        account,
        transport: http(),
      }).extend(publicActions);

      const userType = await client.readContract({
        address: "0x123",
        abi: LoginmanagerAbi,
        functionName: "getUserType",
      });

      if (users[userType] !== "invalidUser") {
        accountDetails.current = {
          seedPhrase,
          account,
          client,
          usertype: users[userType],
        };
        setError(undefined);
        setStage(2);
      } else {
        setError("invalid user");
      }
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const confirmPassword = async () => {
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    const comfirmation = (
      document.getElementById("confirm") as HTMLInputElement
    ).value;

    if (password === comfirmation) {
      const seedPhrase = await encrypt(
        password,
        accountDetails.current.seedPhrase,
      );
      localStorage.setItem("data", seedPhrase);
      setAccount({
        account: accountDetails.current.account,
        client: accountDetails.current.client,
      });
      sessionStorage.setItem("usertype", accountDetails.current.usertype);
      router.push(`/${accountDetails.current.usertype}`);
    } else {
      setError("password missmatch");
    }
  };

  return (
    <div className="flex h-screen w-[70vw] items-center justify-center rounded-l-3xl bg-white">
      {stage === 1 ? (
        <div className="flex flex-col items-center gap-4 rounded-md p-6 shadow-md">
          <h1 className="text-center text-lg font-medium">
            Get started!
            <p className="text-xs font-extralight">
              import the seed phrase of your existing account
            </p>
          </h1>
          <label className="w-full text-sm" htmlFor="seed">
            SeedPhrase
            <input
              type="text"
              id="seed"
              className="flex h-8 w-full rounded border border-zinc-300 placeholder:text-center placeholder:text-sm"
              placeholder={`Enter your 12-key seed-phrase`}
            />
          </label>
          {error && (
            <span className="p-1 text-right text-sm text-red-400">{error}</span>
          )}
          <button
            className="w-full rounded bg-blue-800/90 p-1 text-white"
            onClick={getAccount}
          >
            Sign in
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-md p-6 shadow-md">
          <label className="w-full text-sm" htmlFor="password">
            password
            <input
              type="text"
              id="password"
              className="flex h-8 w-full rounded border border-zinc-200 placeholder:overflow-visible placeholder:text-sm"
            />
          </label>
          <label className="w-full text-sm" htmlFor="confirm">
            confirm password
            <input
              type="text"
              id="confirm"
              className="flex h-8 w-full rounded border border-zinc-200 placeholder:overflow-visible placeholder:text-sm"
            />
          </label>
          {error && <span>{error}</span>}
          <button
            className="w-full rounded bg-blue-800/90 p-1 text-white"
            onClick={confirmPassword}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
