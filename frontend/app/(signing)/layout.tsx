export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen flex-row justify-end bg-blue-800/90">
      {children}
    </div>
  );
}
