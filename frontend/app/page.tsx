"use client";
import Link from "next/link";
import { useAccount } from "@/hooks/accountContext";
import { HealthRecordManagerV2Abi } from "@/abis/HeahthRecordManagerV2abi";
import { HealthRecordManagerAddress, users } from "@/utils/constants";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isLoggedIn, magicClient, ownerAddress, username } = useAccount();
  const router = useRouter();

  const gotoPage = async () => {
    const userInfo = await magicClient!.readContract({
      account: ownerAddress,
      abi: HealthRecordManagerV2Abi,
      address: HealthRecordManagerAddress,
      functionName: "gerUserInfo",
      args: [username!],
    });
    router.push(`/${users[userInfo.userType]}?cid=${userInfo.cid}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {isLoggedIn && (
        <button
          onClick={gotoPage}
          className="absolute right-4 top-8 min-w-[70px] gap-4 rounded bg-blue-800/90 p-2 text-white"
        >
          {`continue session >`}
        </button>
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
