"use client";
import { useAccount } from "@/hooks/accountContext";
import Image from "next/image";
import defaultImage from "@/public/defaultProfile.png";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserInfo } from "@/lib/types";
import { gateway } from "@/lib/constants";
import { CiSearch } from "react-icons/ci";
import { IoIosHome } from "react-icons/io";
import { BsStack } from "react-icons/bs";
import { IoCalendar } from "react-icons/io5";
import { MdNotificationsActive } from "react-icons/md";
import { HiMiniUser } from "react-icons/hi2";
import { MdLogout } from "react-icons/md";
import Link from "next/link";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Patient() {
  const cid = useSearchParams().get("cid");
  const [userInfo, setUserInfo] = useState<UserInfo<"Patient">>();
  const [tabValue, setTabValue] = useState("dashboard");
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
    <div className="relative flex h-screen w-screen flex-row">
      {/* sidebar */}
      <div className="relative flex h-screen w-[170px] flex-col border border-gray-300 p-4 pt-8">
        <Link href={"/"} className="mb-12 text-center text-2xl font-bold text-blue-900/75">
          MEDISTASH
        </Link>
        <ToggleGroup
          value={tabValue}
          onValueChange={(value) => setTabValue(value)}
          type="single"
          defaultValue="dashboard"
          orientation="vertical"
          className="flex flex-col gap-5"
        >
          <ToggleGroupItem
            value="dashboard"
            className="flex flex-row items-center gap-1 rounded-3xl p-4 font-semibold data-[state=off]:self-start data-[state=on]:bg-blue-900/75 data-[state=on]:text-white data-[state=off]:opacity-70"
          >
            <IoIosHome />
            Dashboard
          </ToggleGroupItem>
          <ToggleGroupItem
            value="appointments"
            className="flex flex-row items-center gap-1 rounded-3xl p-4 font-semibold data-[state=off]:self-start data-[state=on]:bg-blue-900/75 data-[state=on]:text-white data-[state=off]:opacity-70"
          >
            <IoCalendar />
            Appointments
          </ToggleGroupItem>
          <ToggleGroupItem
            value="records"
            className="flex flex-row items-center gap-1 rounded-3xl p-4 font-semibold data-[state=off]:self-start data-[state=on]:bg-blue-900/75 data-[state=on]:text-white data-[state=off]:opacity-70"
          >
            <BsStack /> Records
          </ToggleGroupItem>
          <ToggleGroupItem
            value="notification"
            className="flex flex-row items-center gap-1 rounded-3xl p-4 font-semibold data-[state=off]:self-start data-[state=on]:bg-blue-900/75 data-[state=on]:text-white data-[state=off]:opacity-70"
          >
            <MdNotificationsActive />
            Notification
          </ToggleGroupItem>
          <ToggleGroupItem
            value="profile"
            className="flex flex-row items-center gap-1 rounded-3xl p-4 font-semibold data-[state=off]:self-start data-[state=on]:bg-blue-900/75 data-[state=on]:text-white data-[state=off]:opacity-70"
          >
            <HiMiniUser />
            Profile
          </ToggleGroupItem>
        </ToggleGroup>
        <button
          onClick={async () => await logout()}
          className="flow-row absolute bottom-8 flex items-center gap-2 font-medium text-red-500"
        >
          <MdLogout />
          log out
        </button>
      </div>
      <div className="relative flex h-screen grow flex-col items-center justify-start gap-8">
        {/* header */}
        <div className="flex h-[15vh] w-full flex-row items-center justify-end gap-2 border-y border-gray-300 p-8">
          <div className="absolute left-4 text-xl font-medium">Welcome {userInfo?.firstName}</div>
          <div className="flex flex-row items-center gap-1 rounded-md border border-gray-300 bg-white p-1 shadow-sm">
            <CiSearch />
            <input type="text" className=" focus-visible:outline-none" placeholder="search by..." />
          </div>
          <Image src={defaultImage} alt="propile image" className="h-10 w-10 rounded-full" />
        </div>
        {/* content */}
        {tabValue === "profile" ? (
          <div className="flex w-80 flex-col items-center justify-center gap-2 rounded border border-gray-300 p-4">
            <Image src={defaultImage} alt="propile image" className="h-10 w-10 rounded-full" />
            <table>
              <tbody>
                <tr>
                  <td className="pr-2">Name:</td>
                  <td>{`${userInfo?.firstName} ${userInfo?.lastName}`}</td>
                </tr>
                <tr>
                  <td className="pr-2">Email:</td>
                  <td>{userInfo?.email}</td>
                </tr>
                <tr>
                  <td className="pr-2">Phone:</td>
                  <td>{userInfo?.phoneNo}</td>
                </tr>
                <tr></tr>
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
