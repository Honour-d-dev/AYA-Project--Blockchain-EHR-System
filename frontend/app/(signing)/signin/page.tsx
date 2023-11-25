"use client";
import { useState } from "react";
import { HealthRecordManagerAddress, users } from "@/utils/constants";
import { useAccount } from "@/hooks/accountContext";
import { HealthRecordManagerAbi } from "@/abis/HealthRecordManager";

export default function Signin() {
  const [email, setemail] = useState("");
  const { login, magicClient } = useAccount();

  const handleLogin = async () => {
    if (magicClient) {
      const type = await magicClient.readContract({
        abi: HealthRecordManagerAbi,
        address: HealthRecordManagerAddress,
        functionName: "gerUserType",
        args: [email],
      });
      if (users[type] !== "invalidUser") {
        await login(email, users[type]);
      } else {
        //show error invalid user
        return;
      }
    }
  };

  return (
    <div className="flex h-screen w-[70vw] items-center justify-center rounded-l-3xl bg-white">
      <div className=" flex flex-col gap-3 rounded border border-gray-400/30 p-6 shadow-lg">
        <label htmlFor="email">Enter your email</label>
        <input
          className="flex h-8 w-full rounded border border-zinc-300 pl-2 placeholder:overflow-visible placeholder:text-sm"
          type="email"
          id="email"
          onChange={(e) => setemail(e.target.value)}
        />
        <button
          className="w-full rounded bg-blue-800/90 p-1 text-white"
          onClick={handleLogin}
        >
          log in
        </button>
      </div>
    </div>
  );
}
