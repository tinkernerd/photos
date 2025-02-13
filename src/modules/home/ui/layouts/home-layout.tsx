import Header from "../components/header";

export const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      <Header />
      <main className="h-full p-3">{children}</main>
    </div>
  );
};
