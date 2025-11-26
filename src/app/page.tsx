"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function Home() {
  const router = useRouter();
  const { is_authenticated, loading } = useSelector((state:any) => state.auth);

  useEffect(() => {
    // Wait for auth check to complete before redirecting
    if (!loading) {
      if (is_authenticated) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    }
  }, [is_authenticated, loading, router]);

  return (
    <>
    </>
  );
}