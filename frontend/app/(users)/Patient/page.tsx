"use client";
import { useAccount } from "@/hooks/accountContext";

export default function Patient() {
  const { logout } = useAccount();
  return (
    <div className="flex h-screen w-screen flex-row items-center justify-start gap-4">
      {/* side bar */}
      <div className="relative flex h-screen w-[15vw] flex-col border border-gray-300 p-4">
        <h1 className="mb-12 text-center text-2xl font-bold text-blue-900/75">
          MEDISTASH
        </h1>
        <div className="rounded-3xl bg-blue-900/75 p-2 text-center font-medium text-white">
          Dashboard
        </div>
        <div className="p-4 "> Appointments</div>
        <div className="p-4 "> Records</div>
        <div className="p-4 "> Notification</div>
        <div className="p-4 ">Profile</div>
        <div className="absolute bottom-4">log out</div>
      </div>
      {/* main page */}
      <div className="relative flex h-screen w-[85vw] flex-col">
        {/* header */}
        <div className="absolute right-4 top-0 flex flex-row items-center justify-end gap-2 border-y border-gray-300 p-8">
          <div className="rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
            <input
              type="text"
              className=" focus-visible:outline-none"
              placeholder="search by..."
            />
          </div>
          <div className="h-full w-full overflow-hidden rounded-full bg-gray-300">
            no <br />
            image
          </div>
        </div>
        {/* page content */}
        <div></div>
      </div>
    </div>
  );
}

{
  /* {" "}
Patient Page <br /> No data yet.
<button
  className="rounded border border-gray-300 p-4 shadow"
  onClick={async () => await logout()}
>
  logout
</button> */
}
