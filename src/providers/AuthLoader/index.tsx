"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchUser } from "@/store/thunks/authThunks";
import { usePathname, useRouter } from "next/navigation";

export default function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { is_authenticated, fetch_user_loading: loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (pathname !== '/login' && pathname !== '/') {
      dispatch(fetchUser());
    }
  }, []);

  useEffect(() => {
    if (!loading && !is_authenticated && pathname !== '/login') {
      console.log('redirecting to login');
      router.replace('/login');
    }
  }, [is_authenticated, loading, pathname, router]);

  return children;
}
