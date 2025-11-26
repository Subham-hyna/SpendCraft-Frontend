declare module "next-pwa" {
    import { NextConfig } from "next";
  
    interface PWAOptions {
      dest: string;
      register?: boolean;
      skipWaiting?: boolean;
      disable?: boolean;
      swSrc?: string;
    }
  
    export default function withPWA(options: PWAOptions): (nextConfig: NextConfig) => NextConfig;
  }
  