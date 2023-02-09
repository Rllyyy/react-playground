import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LinkStyle =
  "flex flex-row items-center md:w-full gap-4 px-4 py-4 duration-150 rounded-lg hover:no-underline text-zinc-200 ";

const ActiveTabLink = `${LinkStyle} bg-blue-700 hover:bg-blue-900`;
const InactiveTabLink = `${LinkStyle}  dark:hover:bg-zinc-700 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-100`;

export function Sidebar() {
  const router = useRouter();
  const [tab, setTab] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    if (router.pathname.includes("profile")) {
      setTab("profile");
    } else {
      setTab("home");
    }

    return () => {
      setTab("");
    };
  }, [router]);

  return (
    <aside className='flex md:flex-col md:h-full gap-2 p-2 md:p-4 duration-200 bg-white shadow-lg dark:bg-zinc-800 border-r-zinc-200 border-t-[2px] md:border-t-0 dark:border-t-zinc-600'>
      {/* search box */}
      <input
        type='text'
        placeholder='Search'
        className='w-full p-2 px-4 border-2 rounded-lg border-slate-300 dark:border-zinc-800 focus:outline-none focus:border-blue-700 focus:ring-blue-700 dark:focus:border-blue-700 dark:ring-blue-600 focus:ring-0 dark:placeholder-zinc-200 placeholder-zinc-500'
      />
      <Link className={tab === "home" ? ActiveTabLink : InactiveTabLink} href='/chirp'>
        <HomeIcon />
        <span className='hidden text-lg font-semibold md:block '>Home</span>
      </Link>
      <Link className={tab === "profile" ? ActiveTabLink : InactiveTabLink} href='/chirp/profile'>
        <ProfileIcon />
        <span className='hidden text-lg font-semibold md:block'>Profile</span>
      </Link>
      <button className='flex flex-row items-center gap-4 px-4 py-4 mt-auto duration-150 rounded-lg md:w-full dark:hover:bg-zinc-700 hover:bg-zinc-200'>
        <LogoutIcon />
        <span className='hidden text-lg font-semibold md:block'>Logout</span>
      </button>
    </aside>
  );
}

// Source: https://heroicons.com/
function HomeIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='w-7 h-7'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
      />
    </svg>
  );
}

// Source: https://heroicons.com/
function ProfileIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='w-7 h-7'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
      />
    </svg>
  );
}

// Source: https://heroicons.com/
function LogoutIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='w-7 h-7'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75'
      />
    </svg>
  );
}
