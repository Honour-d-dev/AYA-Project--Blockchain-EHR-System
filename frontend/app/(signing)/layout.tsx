import bg from "@/public/medistash.jpg";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-row">
      <Image className="-mr-6 w-[30%]" src={bg} alt="bg" />
      <div className="flex h-screen w-[70%] items-center justify-center rounded-l-3xl bg-white">
        {children}
      </div>
    </div>
  );
}
