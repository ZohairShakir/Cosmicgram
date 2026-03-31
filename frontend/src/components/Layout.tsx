import { ReactNode } from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:ml-[245px] pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 lg:py-8 lg:px-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
