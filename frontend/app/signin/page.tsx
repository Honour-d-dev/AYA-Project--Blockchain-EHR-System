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

const users = [
  "invalidUser",
  "Admin",
  "HealthCI",
  "HealthCP",
  "Doctor",
  "Patient",
] as const;

type TAccountDetails = {
  seedPhrase: string;
  account: HDAccount;
  client: WalletClient;
  usertype: string;
};

export default function Signin() {
  const [error, setError] = useState("");
  const [stage, setStage] = useState<1 | 2>(1);
  const { setAccount } = useContext(AccountContext);

  const accountDtails = useRef({} as TAccountDetails);

  const getAccount = async () => {
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

    if (users[userType] === "invalidUser") {
      setError("invalid user");
    } else {
      accountDtails.current = {
        seedPhrase,
        account,
        client,
        usertype: users[userType],
      };
      setError("");
      setStage(2);
    }
  };

  const confirmPassword = async () => {
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    const comfirmation = (
      document.getElementById("confirmation") as HTMLInputElement
    ).value;

    if (password === comfirmation) {
      const secret = await encrypt(password, accountDtails.current.seedPhrase);
      localStorage.setItem("data", secret);
      setAccount({
        account: accountDtails.current.account,
        client: accountDtails.current.client,
      });
      //route the user to required page based on usertype
    } else {
      setError("password missmatch");
    }
  };

  return (
    <div>
      {stage === 1 ? (
        <div>
          <label htmlFor="seed">
            SeedPhrase
            <input
              type="text"
              id="seed"
              placeholder="Enter your 12-key seed-phrase, seperate with space"
            />
          </label>
          {error && <span>{error}</span>}
          <button onClick={getAccount}>Sign in</button>
        </div>
      ) : (
        <div>
          <label htmlFor="password">
            password
            <input type="text" id="password" />
          </label>
          <label htmlFor="confirmation">
            confirm password
            <input type="text" id="confirmation" />
          </label>
          {error && <span>{error}</span>}
          <button onClick={confirmPassword}>Done</button>
        </div>
      )}
    </div>
  );
}
