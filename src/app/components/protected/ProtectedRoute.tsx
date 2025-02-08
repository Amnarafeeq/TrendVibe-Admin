"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  params?: { [key: string]: string | number | boolean | string[] | undefined };
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn");

      if (!isLoggedIn) {
        router.replace("/admin"); // Prevents back button navigation
      }
    }
  }, [router]);

  return <>{children}</>;
};

export default ProtectedRoute;
