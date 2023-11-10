"use client";
import { useContext, useRef, useState } from "react";
import { storageClient, users } from "@/constants/constants";
import { HealthRecordManagerAbi } from "@/abis/HealthRecordManager";
import { AccountContext } from "@/components/context/accountContext";
import { english, generateMnemonic, mnemonicToAccount } from "viem/accounts";
import { type CIDString } from "web3.storage";
import { createWalletClient, http, publicActions } from "viem";
import { encrypt } from "@metamask/browser-passworder";
import { useRouter } from "next/navigation";

type TUserDetails = {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  type: string;
};

type TPrivateDetails = {
  seedPhrase: string;
  password: string;
  cid: CIDString;
};

export default function Signup() {
  const [stage, setStage] = useState(1);
  const [error, showError] = useState<string>();
  const [privateDetails, setPrivateDetails] = useState({} as TPrivateDetails);
  const { setAccount } = useContext(AccountContext);

  const userDetails = useRef({} as TUserDetails);
  const router = useRouter();

  const next = (usertype: number) => {
    userDetails.current.type = users[usertype];
    setStage((k) => k + 1);
  };

  const submit = async () => {
    const password = document.getElementById("password") as HTMLInputElement;
    const confirm = document.getElementById("confirm") as HTMLInputElement;
    if (password.value === confirm.value) {
      const file = new File([JSON.stringify(userDetails.current)], "data");
      console.log(await file.text());
      const cid = "abcd"; //await storageClient.put([file], { wrapWithDirectory: false });
      const seedPhrase = generateMnemonic(english);
      setPrivateDetails({
        seedPhrase,
        password: password.value,
        cid,
      });
      setStage((k) => k + 1);
    } else {
      showError("password missmatch");
    }
  };

  const initAccount = async () => {
    const account = mnemonicToAccount(privateDetails.seedPhrase);
    const client = createWalletClient({
      account,
      transport: http(),
    }).extend(publicActions);
    const enSeedPhrase = await encrypt(
      privateDetails.password,
      privateDetails.seedPhrase,
    );
    localStorage.setItem("data", enSeedPhrase);
    setAccount({
      account,
      client,
    });
    //cid & usertype will be put on-chain here(using the SCA and paymaster)
    //cid might/should also be added to the account context
    router.push(`/${userDetails.current.type}`);
  };

  return (
    <div className="flex h-screen w-[70vw] items-center justify-center rounded-l-3xl bg-white">
      {stage === 1 && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-blue-800/90">
            Select an option that best describe you
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button
              className="rounded-md border border-blue-800/50 p-3"
              onClick={() => next(5)}
            >
              Patient
            </button>
            <button
              className="rounded-md border border-blue-800/50 p-3"
              onClick={() => next(2)}
            >
              Health Organisation
            </button>
            <button
              className="rounded-md border border-blue-800/50 p-3"
              onClick={() => next(3)}
            >
              Standalone Health Practitioner <br />
              /Researcher
            </button>
            <button
              className="rounded-md border border-blue-800/50 p-3"
              onClick={() => next(4)}
            >
              Doctor
            </button>
          </div>
        </div>
      )}
      {stage === 2 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex flex-col items-center gap-4 rounded-md p-6 shadow-md"
        >
          <h1>Get started!</h1>
          <div className=" flex flex-row gap-4">
            <label className="w-full text-sm" htmlFor="first">
              first name
              <input
                className="flex h-8 w-full rounded border border-zinc-300 placeholder:overflow-visible placeholder:text-sm"
                type="text"
                id="first"
                required
                onChange={(e) =>
                  (userDetails.current.firstName = e.target.value)
                }
              />
            </label>
            <label className="w-full text-sm" htmlFor="last">
              last name
              <input
                className="flex h-8 w-full rounded border border-zinc-300 placeholder:overflow-visible placeholder:text-sm"
                type="text"
                id="last"
                required
                onChange={(e) =>
                  (userDetails.current.lastName = e.target.value)
                }
              />
            </label>
          </div>
          <label className="w-full text-sm" htmlFor="mobile">
            phone number
            <input
              className="flex h-8 w-full rounded border border-zinc-300 placeholder:overflow-visible placeholder:text-sm"
              type="text"
              id="mobile"
              required
              onChange={(e) => (userDetails.current.mobile = e.target.value)}
            />
          </label>
          <label className="w-full text-sm" htmlFor="email">
            email
            <input
              className="flex h-8 w-full rounded border border-zinc-300 placeholder:overflow-visible placeholder:text-sm"
              type="text"
              id="email"
              required
              onChange={(e) => (userDetails.current.email = e.target.value)}
            />
          </label>
          <label className="w-full text-sm" htmlFor="password">
            password
            <input
              className="flex h-8 w-full rounded border border-zinc-300 text-sm placeholder:overflow-visible placeholder:text-sm"
              type="password"
              id="password"
              required
            />
          </label>
          <label className="w-full text-sm" htmlFor="confirm">
            confirm password
            <input
              className="flex h-8 w-full rounded border border-zinc-300 placeholder:overflow-visible placeholder:text-sm"
              type="password"
              id="confirm"
              required
            />
          </label>
          {error && (
            <span className="p-1 text-right text-sm text-red-400">{error}</span>
          )}
          <button
            className="w-full rounded bg-blue-800/90 p-1 text-white"
            type="submit"
          >
            Sign up
          </button>
        </form>
      )}
      {stage === 3 && (
        <div className="flex flex-col items-center gap-4">
          <span>copy your seed phrase</span>
          <div className="grid grid-cols-3 gap-2 rounded border border-zinc-300 p-4">
            {privateDetails.seedPhrase.split(" ").map((word) => {
              return <div key={word}>{word}</div>;
            })}
          </div>
          <button className="w-full rounded bg-blue-800/90 p-1 text-white">
            Done
          </button>
        </div>
      )}
    </div>
  );
}
