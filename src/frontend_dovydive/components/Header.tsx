"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white/90 border-b py-3">
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">DovyDive</Link>
        <nav className="space-x-4">
          <Link href="/locations" className="text-sm">Locations</Link>
          <Link href="/species" className="text-sm">Species</Link>
          <Link href="/map" className="text-sm">Map</Link>
          <Link href="/chat" className="text-sm">AI Chat</Link>
        </nav>
      </div>
    </header>
  );
}
