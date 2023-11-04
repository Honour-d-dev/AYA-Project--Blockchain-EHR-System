export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex h-[70vh] w-[70vw] flex-col items-center justify-center gap-4 rounded-md shadow">
        <h1 className="border-b border-zinc-500 text-center text-3xl">
          WELCOME
        </h1>
        Get started
        <span className=" flex gap-10">
          <button className="border-b border-zinc-500">Sign up</button>
          <button className="border-b border-zinc-500">Sign in</button>
        </span>
      </div>
    </main>
  );
}
