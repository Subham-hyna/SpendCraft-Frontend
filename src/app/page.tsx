"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state:any) => state.auth);

  useEffect(() => {
    router.replace('/login');
  }, []);

  return (
    <>
    </>
  );
}