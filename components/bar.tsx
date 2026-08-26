import Link from "next/link";

const Bar = () => {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 text-white sm:px-10">
      <Link href="/" className="whitespace-nowrap font-semibold tracking-tight text-2xl">VIKB</Link>
      <Link href="/jobs?country=australia" className="whitespace-nowrap rounded-md border border-white/60 px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-white hover:text-zinc-950">
        Australia jobs →
      </Link>
    </header>
  );
};

export default Bar;
