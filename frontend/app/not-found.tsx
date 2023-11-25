"use client";
import { useAccount } from "@/hooks/accountContext";
import Link from "next/link";

export default function NotFound() {
  const { logout } = useAccount();
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
      <h2>Page Not Found</h2>
      <Link className="rounded border border-gray-300 p-4 shadow" href="/">
        Return Home
      </Link>
      <button
        className="rounded border border-gray-300 p-4 shadow"
        onClick={async (e) => {
          e.preventDefault();
          await logout();
        }}
      >
        logout
      </button>
    </div>
  );
}
