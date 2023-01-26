import { useState, useEffect, SVGProps } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const handleThemeSwitch = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <nav className='sticky top-0 flex items-center justify-between w-full max-w-full px-6 py-2 duration-200 drop-shadow-lg bg-zinc-200 dark:bg-zinc-900'>
      <Link href={{ pathname: "/" }}>
        <h1 className='text-2xl font-bold'>Logo</h1>
      </Link>
      <button
        className='cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-800 p-2 rounded-lg hover:text-sky-600 transition-[background]'
        onClick={handleThemeSwitch}
      >
        <ThemeSwitchIcon currentTheme={currentTheme} className='w-6 h-6 ' />
      </button>
    </nav>
  );
}

interface IThemeSwitchIcon extends SVGProps<SVGSVGElement> {
  currentTheme: string | undefined;
}

const ThemeSwitchIcon: React.FC<IThemeSwitchIcon> = ({ currentTheme, ...props }) => {
  return (
    <>
      {currentTheme === "light" ? (
        /* Moon Icon */
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
          <path
            fillRule='evenodd'
            d='M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z'
            clipRule='evenodd'
          />
        </svg>
      ) : (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' {...props}>
          <path d='M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z' />
        </svg>
      )}
    </>
  );
};
