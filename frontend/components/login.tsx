import { decrypt } from "@metamask/browser-passworder";
import { AccountContext } from "@/components/context/accountContext";
import { useContext, useState } from "react";
import { mnemonicToAccount } from "viem/accounts";
import { createWalletClient, http, publicActions } from "viem";
import { LoginmanagerAbi } from "@/abis/LoginManagerAbi";
import { users } from "@/app/user-types";
import { useRouter } from "next/navigation";

export default function Login() {
  const { setAccount } = useContext(AccountContext);
  const [error, setError] = useState<string>();
  const router = useRouter();

  const unlock = async () => {
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    const enData = localStorage.getItem("data");
    try {
      const deData = (await decrypt(password, enData!)) as string;
      const account = mnemonicToAccount(deData);
      const client = createWalletClient({
        account,
        transport: http(),
      }).extend(publicActions);

      const usertype = await client.readContract({
        address: "0x123",
        abi: LoginmanagerAbi,
        functionName: "getUserType",
      });

      sessionStorage.setItem("usertype", users[usertype]);
      sessionStorage.setItem("password", password);

      setAccount({
        account,
        client,
      });
      router.push(`/${users[usertype]}`);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="absolute z-20 flex h-screen w-screen items-center justify-center bg-transparent backdrop-blur-[3px]">
      <div className="flex flex-col gap-2 rounded-md bg-zinc-300 p-6">
        <h1 className="text-xl font-bold">Login</h1>
        <label htmlFor="password" className="">
          Enter password
          <input type="text" id="password" className=" flex w-full rounded" />
        </label>
        {error && (
          <span className="p-1 text-right text-sm text-red-400">{error}</span>
        )}
        <button
          className="w-full rounded bg-blue-800/90 p-1 text-white"
          onClick={unlock}
        >
          login
        </button>
      </div>
    </div>
  );
}
