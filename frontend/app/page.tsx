"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Login from "@/components/login";
import Link from "next/link";

export default function Home() {
  const [login, showLogin] = useState(false);
  const router = useRouter();

  //nextjs complaining about localstorage
  const localHasData =
    typeof localStorage !== "undefined" && localStorage.length > 0;

  const reRoute = () => {
    if (sessionStorage.length) {
      const usertype = sessionStorage.getItem("usertype");
      router.push(`/${usertype}`);
    } else {
      showLogin(true);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {localHasData && (
        <button
          className="absolute right-4 top-8 min-w-[70px] rounded bg-blue-800/90 p-2 text-white"
          onClick={reRoute}
        >
          {sessionStorage.length ? `continue session >` : ` log in `}
        </button>
      )}
      {login && <Login />}
      <div className="flex h-[70vh] w-[70vw] flex-col items-center justify-center gap-4">
        <h1 className=" text-center text-4xl">MEDISTASH</h1>
        <div className="absolute bottom-0 flex w-screen flex-row items-center justify-evenly p-6">
          <Link
            href="/signup"
            className="flex flex-col items-center justify-center rounded-md text-center shadow-sm transition duration-500 ease-in-out hover:scale-110 hover:bg-zinc-200"
          >
            <span className=" p-2 font-bold">Don't have an account? </span>
            <span className=" mb-2 w-fit border-b border-zinc-400">
              sign up
            </span>
          </Link>
          <Link
            href="/signin"
            className="flex flex-col items-center justify-center rounded-md text-center shadow-sm transition duration-500 ease-in-out hover:scale-110 hover:bg-zinc-200"
          >
            <p className=" whitespace-nowrap p-2 font-bold">
              importing an existing account?{" "}
            </p>
            <p className=" mb-2 border-b border-zinc-400">sign in</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
