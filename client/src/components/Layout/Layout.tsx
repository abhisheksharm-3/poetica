"use client"
import { cn } from "@/Lib/utils";
import { ReactNode } from "react";
import { DockedNavbar } from "./DockedNavbar";
import Footer from "./Footer";

const Layout = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {

  return (
    <div
      className={cn(
        "w-screen min-h-screen bg-background",
        className
      )}
    >
      <DockedNavbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;