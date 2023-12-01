"use client";
import { useAccount } from "@/hooks/accountContext";
import Image from "next/image";
import defaultImage from "@/public/defaultProfile.png";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserInfo } from "@/utils/types";
import { gateway } from "@/utils/constants";
import { CiSearch } from "react-icons/ci";
import { IoIosHome } from "react-icons/io";
import { BsStack } from "react-icons/bs";
import { IoCalendar } from "react-icons/io5";
import { MdNotificationsActive } from "react-icons/md";
import { HiMiniUser } from "react-icons/hi2";
import { MdLogout } from "react-icons/md";

export default function Patient() {
  const cid = useSearchParams().get("cid");
  const [userInfo, setUserInfo] = useState<UserInfo<"Patient">>();
  const { logout } = useAccount();

  useEffect(() => {
    async function getUserInfo() {
      if (cid) {
        const response = await fetch(gateway(cid));
        const userInfo: UserInfo<"Patient"> = await response.json();
        console.log(response, userInfo);
        setUserInfo(userInfo);
      }
    }
    getUserInfo();
  }, [cid]);
  return (
    <div className="flex h-screen w-screen flex-row items-center justify-start">
      {/* side bar */}
      <div className="relative flex h-screen w-[20vw] min-w-[180px] flex-col border border-gray-300 p-4">
        <h1 className="mb-12 text-center text-2xl font-bold text-blue-900/75">
          MEDISTASH
        </h1>
        <div className="flex flex-row items-center justify-center gap-1 rounded-3xl bg-blue-900/75 p-2 text-center font-medium text-white">
          <IoIosHome />
          Dashboard
        </div>
        <div className="flex flex-row items-center gap-1 p-4 font-medium opacity-70">
          <IoCalendar />
          Appointments
        </div>
        <div className="flex flex-row items-center gap-1 p-4 font-medium opacity-70">
          <BsStack /> Records
        </div>
        <div className="flex flex-row items-center gap-1 p-4 font-medium opacity-70">
          <MdNotificationsActive />
          Notification
        </div>
        <div className="flex flex-row items-center gap-1 p-4 font-medium opacity-70">
          <HiMiniUser />
          Profile
        </div>
        <button
          onClick={async () => await logout()}
          className="flow-row absolute bottom-8 flex items-center gap-2 font-medium text-red-500"
        >
          <MdLogout />
          log out
        </button>
      </div>
      {/* main page */}
      <div className="relative flex h-screen w-[80vw] flex-col">
        {/* header */}
        <div className="absolute right-0 top-0 flex w-full flex-row items-center justify-end gap-2 border-y border-gray-300 p-8">
          <div className="absolute left-4 text-xl font-medium">
            Welcome, {userInfo?.firstName}
          </div>
          <div className="flex flex-row items-center gap-1 rounded-md border border-gray-300 bg-white p-1 shadow-sm">
            <CiSearch />
            <input
              type="text"
              className=" focus-visible:outline-none"
              placeholder="search by..."
            />
          </div>
          <Image
            src={defaultImage}
            alt="propile image"
            className="h-10 w-10 rounded-full"
          />
        </div>
        {/* page content */}
        <div></div>
      </div>
    </div>
  );
}
