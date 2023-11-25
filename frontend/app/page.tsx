"use client";
import Link from "next/link";
import { useAccount } from "@/hooks/accountContext";

export default function Home() {
  const { isLoggedIn } = useAccount();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {isLoggedIn && (
        <Link
          href={"/usertype/id"}
          className="absolute right-4 top-8 min-w-[70px] gap-4 rounded bg-blue-800/90 p-2 text-white"
        >
          {`continue session >`}
        </Link>
      )}
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
              Already have an account?{" "}
            </p>
            <p className=" mb-2 border-b border-zinc-400">sign in</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
