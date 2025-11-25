"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchUser } from "@/store/thunks/authThunks";
import { usePathname, useRouter } from "next/navigation";

export default function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { is_authenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (pathname !== '/login') {
      dispatch(fetchUser());
    }
  }, [pathname]);

  useEffect(() => {
    if (!is_authenticated) {
      router.replace('/login');
    }
  }, [is_authenticated]);

  return children;
}
