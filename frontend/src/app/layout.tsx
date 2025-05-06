import "swiper/css";
import "./globals.css";
import "@/styles/index.scss";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "rc-slider/assets/index.css";
import "flatpickr/dist/flatpickr.css";
import "react-phone-number-input/style.css";
import "simplebar-react/dist/simplebar.min.css";

import { PropsWithChildren } from "react";
import { Poppins } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "@/trpc/react";

const poppins = Poppins({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
});

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <NuqsAdapter>
          <TRPCReactProvider>
            <SessionProvider>{children}</SessionProvider>
          </TRPCReactProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
