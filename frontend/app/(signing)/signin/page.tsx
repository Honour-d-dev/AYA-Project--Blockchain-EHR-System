"use client";
import { useState } from "react";
import { HealthRecordManagerAddress, users } from "@/utils/constants";
import { useAccount } from "@/hooks/accountContext";
import { HealthRecordManagerV2Abi } from "@/abis/HeahthRecordManagerV2abi";
import Link from "next/link";

export default function Signin() {
  const [email, setemail] = useState("");
  const { loginExistingUser, login, magicClient, ownerAddress } = useAccount();

  const handleLogin = async () => {
    if (magicClient) {
      const isUser = await magicClient.readContract({
        account: ownerAddress,
        abi: HealthRecordManagerV2Abi,
        address: HealthRecordManagerAddress,
        functionName: "isUser",
        args: [email],
      });
      if (isUser) {
        await loginExistingUser(email);
      } else {
        //show error invalid user
        return;
      }
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center rounded-l-3xl bg-white">
      <div className=" flex flex-col items-center gap-3 rounded border border-gray-400/30 p-6 shadow-lg">
        <h1 className="mb-8 text-center text-2xl font-bold text-blue-800/90">Welcome Back!</h1>
        <label htmlFor="email">Enter your email</label>
        <input
          className="flex h-8 w-full rounded border border-zinc-300 pl-2 placeholder:overflow-visible placeholder:text-sm"
          type="email"
          id="email"
          onChange={(e) => setemail(e.target.value)}
        />
        <button className="w-full rounded bg-blue-800/90 p-1 text-white" onClick={handleLogin}>
          log in
        </button>
        <span className="text-xs">
          Don't have an account?{" "}
          <Link className="text-blue-800/90 hover:underline" href={`/signup`}>
            create an account
          </Link>
        </span>
      </div>
    </div>
  );
}
