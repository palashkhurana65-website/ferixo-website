// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // We are forcing the hex code here with brackets
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A1A2F] px-4 pt-32 pb-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {children}
      </div>
    </div>
  );
}