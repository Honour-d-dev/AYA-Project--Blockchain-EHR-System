"use client";
import { useRegister } from "@/hooks/useRegister";
import { UserInfo } from "@/lib/types";
import { useRef } from "react";
import { CgSpinner } from "react-icons/cg";

export default function HealthCI() {
  const userDetails = useRef({} as UserInfo<"HealthCI">);
  const { initAccount, progress, error } = useRegister("HealthCI", userDetails.current);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          initAccount();
        }}
        className="flex flex-col items-center gap-4 rounded-md border border-gray-200 p-6 shadow-lg"
      >
        <h1>Get started!</h1>
        <label className="w-full text-sm" htmlFor="name">
          name
          <input
            className="flex h-8 w-full rounded border border-zinc-300 pl-2 placeholder:overflow-visible placeholder:text-sm"
            type="text"
            id="name"
            required
            onChange={(e) => (userDetails.current.name = e.target.value)}
          />
        </label>
        <label className="w-full text-sm" htmlFor="email">
          email
          <input
            className="flex h-8 w-full rounded border border-zinc-300 pl-2 placeholder:overflow-visible placeholder:text-sm"
            type="text"
            id="email"
            required
            onChange={(e) => (userDetails.current.email = e.target.value)}
          />
        </label>
        <label className="w-full text-sm" htmlFor="mobile">
          phone number
          <input
            className="flex h-8 w-full rounded border border-zinc-300 pl-2 placeholder:overflow-visible placeholder:text-sm"
            type="text"
            id="mobile"
            required
            onChange={(e) => (userDetails.current.phoneNo = e.target.value)}
          />
        </label>
        <label className="w-full text-sm" htmlFor="address">
          location/address
          <input
            className="flex h-8 w-full rounded border border-zinc-300 pl-2 placeholder:overflow-visible placeholder:text-sm"
            type="text"
            id="address"
            required
            onChange={(e) => (userDetails.current.address = e.target.value)}
          />
        </label>
        <button className="w-full rounded bg-blue-800/90 p-1 text-white" type="submit">
          {progress ? (
            <span className=" flex flex-row items-center justify-center gap-4">
              {progress} <CgSpinner className="h-6 w-6 animate-spin" />
            </span>
          ) : (
            "sign up"
          )}
        </button>
        <span className="text-xs text-red-500">{error}</span>
      </form>
    </div>
  );
}
