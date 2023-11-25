import Link from "next/link";

export default function Signup() {
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-blue-800/90">
        Select an option that best describe you
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Link
          href={"/signup/Patient"}
          className="rounded-md border border-blue-800/50 p-3 text-center"
        >
          Patient
        </Link>
        <Link
          href={"/signup/HealthCI"}
          className="rounded-md border border-blue-800/50 p-3 text-center"
        >
          Health Organisation
        </Link>
        <Link
          href={"/signup/Researcher"}
          className="rounded-md border border-blue-800/50 p-3 text-center"
        >
          Researcher
        </Link>
        <Link
          href={"signup/Doctor"}
          className="rounded-md border border-blue-800/50 p-3 text-center"
        >
          Doctor
        </Link>
      </div>
    </div>
  );
}
