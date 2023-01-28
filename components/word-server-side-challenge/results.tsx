import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { container, motionItem } from "../word-challenge/framer-styles";

export interface IItem {
  word: string;
  score: number;
  tags: string[];
}

interface IResults {
  results: IItem[] | undefined | null;
  error: string | undefined;
}

export const Results = ({ results, error }: IResults) => {
  if (error) {
    return <p className='text-xl font-semibold'>{error}</p>;
  }

  if (!results || results?.length === 0) {
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
                pathname: "/word-server-side-challenge",
                query: { value: item.word },
              }}
              /* shallow */
              className='text-sm font-semibold hover:no-underline text-zinc-100 w-max'
            >
              {index + 1}. {item.word}
            </Link>
          </motion.div>
        );
      })}
    </motion.section>
  );
};
