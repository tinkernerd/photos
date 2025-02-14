import Header from "../components/header";

export const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen">
      <Header />
      <main className="p-3">{children}</main>
    </div>
  );
};
