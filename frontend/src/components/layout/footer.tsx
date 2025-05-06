import { CurrencyDropdown } from "@/components/layout/currency-dropdown";
import { LanguageDropdown } from "@/components/layout/language-dropdown";
import { Logo } from "@/components/logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full">
      <div className="my-16 h-[1px] w-full bg-slate-200"></div>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 px-4 py-4 md:grid-cols-4">
        <div className="flex flex-col">
          <Logo />
          <div className="flex flex-col items-start space-y-3 py-4">
            <p className="">Votre sejour parfait,Simplifie</p>
            <a href="">Facebook</a>
            <a href="">Instagram</a>
            <div className="">
              <LanguageDropdown />
              <CurrencyDropdown />
            </div>
          </div>
        </div>
        <div>
          <h3 className="py-5 font-semibold text-title md:p-0">Our Listings</h3>
          <div className="flex flex-col space-y-3 py-4 text-body">
            <Link href="/listings">Douala</Link>
            <Link href="/listings">Yaounde</Link>
            <Link href="/listings">Bafoussam</Link>
          </div>
        </div>
        <div>
          <h3 className="py-5 font-semibold text-title md:py-0">CoziStay</h3>
          <div className="flex flex-col space-y-3 py-4">
            <Link href="/about">About Us</Link>
            <Link href="/contact">Jobs</Link>
            <Link href="/blog">Become Partner</Link>
            <Link href="/blog">Support</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 py-16 md:flex-row lg:px-10">
        <p className="text-title">© 2024 CoziStay. All rights reserved</p>
        <div className="flex items-center space-x-3">
          <p className="underline">Privacy Policy</p>
          <p className="underline">Terms of Service</p>
        </div>
      </div>
    </footer>
  );
}
