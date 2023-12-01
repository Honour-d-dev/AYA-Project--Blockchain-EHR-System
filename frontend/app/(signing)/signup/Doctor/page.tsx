"use client";
import { useRegister } from "@/hooks/useRegister";
import { UserInfo } from "@/utils/types";
import { useRef } from "react";

export default function Doctor() {
  const userDetails = useRef({} as UserInfo<"Doctor">);
  const initRegister = useRegister("Doctor", userDetails.current);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          initRegister();
        }}
        className="flex flex-col items-center gap-4 rounded-md border border-gray-200 p-6 shadow-lg"
      >
        <h1>Get started!</h1>
        <div className=" flex flex-row gap-4">
          <label className="w-full text-sm" htmlFor="first">
            first name
            <input
              className="flex h-8 w-full rounded border border-zinc-300 pl-2 placeholder:overflow-visible placeholder:text-sm"
              type="text"
              id="first"
              required
              onChange={(e) => (userDetails.current.firstName = e.target.value)}
            />
          </label>
          <label className="w-full text-sm" htmlFor="last">
            last name
            <input
              className="flex h-8 w-full rounded border border-zinc-300 pl-2 placeholder:overflow-visible placeholder:text-sm"
              type="text"
              id="last"
              required
              onChange={(e) => (userDetails.current.lastName = e.target.value)}
            />
          </label>
        </div>
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
        <label className="w-full text-sm" htmlFor="DOB">
          date of birth
          <input
            className="flex h-8 w-full rounded border border-zinc-300 pl-2 placeholder:overflow-visible placeholder:text-sm"
            type="date"
            id="DOB"
            required
            onChange={(e) => (userDetails.current.DOB = e.target.value)}
          />
        </label>
        <label className="w-full text-sm" htmlFor="HId">
          hospital id
          <input
            className="flex h-8 w-full rounded border border-zinc-300 pl-2 placeholder:overflow-visible placeholder:text-sm"
            type="text"
            id="HId"
            required
            onChange={(e) =>
              (userDetails.current.healthcareId = e.target.value)
            }
          />
        </label>
        <label className="w-full text-sm" htmlFor="password">
          password
          <input
            className="flex h-8 w-full rounded border border-zinc-300 pl-2 text-sm placeholder:overflow-visible placeholder:text-sm"
            type="password"
            id="password"
            required
          />
        </label>
        <label className="w-full text-sm" htmlFor="confirm">
          confirm password
          <input
            className="flex h-8 w-full rounded border border-zinc-300 pl-2 placeholder:overflow-visible placeholder:text-sm"
            type="password"
            id="confirm"
            required
          />
        </label>

        <button
          className="w-full rounded bg-blue-800/90 p-1 text-white"
          type="submit"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}
