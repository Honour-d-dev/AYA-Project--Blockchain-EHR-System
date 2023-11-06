"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Login from "@/components/login";

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
    <main className="flex min-h-screen flex-col items-center justify-between">
      {localHasData && (
        <button onClick={reRoute}>
          {sessionStorage.length ? `continue session` : `log in`}
        </button>
      )}
      {login && <Login />}
      <div className="flex h-[70vh] w-[70vw] flex-col items-center justify-center gap-4 rounded-md shadow">
        <h1 className="border-b border-zinc-500 text-center text-3xl">
          WELCOME
        </h1>
        Get started
        <span className=" flex gap-10">
          <button className="border-b border-zinc-500">Sign up</button>
          <button
            className="border-b border-zinc-500"
            onClick={() => router.push("/signin")}
          >
            Sign in
          </button>
        </span>
      </div>
    </main>
  );
}
