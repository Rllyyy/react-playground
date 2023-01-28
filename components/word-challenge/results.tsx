import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { container, motionItem } from "./framer-styles";

interface IItem {
  word: string;
  score: number;
  tags: string[];
}

export const Results = React.memo(() => {
  const router = useRouter();
  const [results, setResults] = useState<IItem[] | undefined>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    const apiURL = "https://api.datamuse.com";
    const urlWord = (router.query["value"] as string).replaceAll(" ", "+");

    try {
      const res = await fetch(`${apiURL}/words?ml=${urlWord}&max=50`);

      if (res.ok) {
        const json: IItem[] | undefined = await res.json();
        setResults(json);
        setLoading(false);
      } else {
        console.error(res.statusText || res.status);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }, [router]);

  useEffect(() => {
    if (router.isReady && router.query["value"] && typeof router.query["value"] === "string") {
      fetchResults();
    }

    return () => {
      setResults([]);
      setLoading(true);
    };
  }, [router, fetchResults]);

  if (loading && router.query["value"]) {
    return (
      <svg
        className='w-8 h-8 mr-3 -ml-1 text-slate-500 dark:text-zinc-100 animate-spin'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
      >
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        ></path>
      </svg>
    );
  }

  if ((!loading && results?.length === 0) || (!loading && !results)) {
    return <p className='text-xl font-semibold'>No results!</p>;
  }

  return (
    <motion.section
      className='flex flex-row flex-wrap items-center justify-center max-w-5xl gap-2'
      variants={container}
      initial='hidden'
      animate='show'
    >
      {results?.map((item, index) => {
        return (
          <motion.div
            key={index}
            variants={motionItem}
            className='flex px-3 py-1 transition-colors rounded-full bg-sky-500 align-center hover:bg-sky-600'
          >
            <Link
              href={{
                pathname: "/word-challenge",
                query: { value: item.word },
              }}
              shallow
              className='text-sm font-semibold hover:no-underline text-zinc-100 w-max'
            >
              {index + 1}. {item.word}
            </Link>
          </motion.div>
        );
      })}
    </motion.section>
  );
});
