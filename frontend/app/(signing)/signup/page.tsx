"use client";
import { useState } from "react";
import { createHelia } from "helia";

export default function Signup() {
  const [stage, setStage] = useState(1);

  const next = () => {
    setStage((k) => k + 1);
  };

  const submit = async () => {
   
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
              onClick={next}
            >
              Patient
            </button>
            <button
              className="rounded-md border border-blue-800/50 p-3"
              onClick={next}
            >
              Health Organisation
            </button>
            <button
              className="rounded-md border border-blue-800/50 p-3"
              onClick={next}
            >
              Standalone Health Practitioner <br />
              /Researcher
            </button>
            <button
              className="rounded-md border border-blue-800/50 p-3"
              onClick={next}
            >
              Doctor
            </button>
          </div>
        </div>
      )}
      {stage === 2 && (
        <div className="flex flex-col items-center gap-4 rounded-md p-6 shadow-md">
          <h1>Get started!</h1>
          <div className=" flex flex-row gap-4">
            <label className="w-full text-sm" htmlFor="first">
              first name
              <input
                className="flex h-8 w-full rounded border border-zinc-300 placeholder:overflow-visible placeholder:text-sm"
                type="text"
                id="first"
              />
            </label>
            <label className="w-full text-sm" htmlFor="last">
              last name
              <input
                className="flex h-8 w-full rounded border border-zinc-300 placeholder:overflow-visible placeholder:text-sm"
                type="text"
                id="last"
              />
            </label>
          </div>
          <label className="w-full text-sm" htmlFor="mobile">
            phone number
            <input
              className="flex h-8 w-full rounded border border-zinc-300 placeholder:overflow-visible placeholder:text-sm"
              type="text"
              id="mobile"
            />
          </label>
          <label className="w-full text-sm" htmlFor="email">
            email
            <input
              className="flex h-8 w-full rounded border border-zinc-300 placeholder:overflow-visible placeholder:text-sm"
              type="text"
              id="email"
            />
          </label>
          <label className="w-full text-sm" htmlFor="password">
            password
            <input
              className="flex h-8 w-full rounded border border-zinc-300 placeholder:overflow-visible placeholder:text-sm"
              type="text"
              id="password"
            />
          </label>
          <label className="w-full text-sm" htmlFor="confirm">
            confirm password
            <input
              className="flex h-8 w-full rounded border border-zinc-300 placeholder:overflow-visible placeholder:text-sm"
              type="text"
              id="confirm"
            />
          </label>
          <button
            className="w-full rounded bg-blue-800/90 p-1 text-white"
            onClick={submit}
          >
            Sign up
          </button>
        </div>
      )}
    </div>
  );
}
