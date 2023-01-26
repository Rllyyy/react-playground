import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

export function Form() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchValue === undefined || !router.isReady) return;

    router.push(
      {
        pathname: "/word-challenge",
        query: searchValue ? `value=${searchValue}` : undefined,
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    if (router.isReady && router.query["value"] && typeof router.query["value"] === "string") {
      setSearchValue(router.query["value"]);
    }

    return () => {
      setSearchValue("");
    };
  }, [router]);

  return (
    <form className='space-x-2' onSubmit={handleSubmit}>
      <label htmlFor='word-search-input' className='text-xl font-semibold'>
        Word:
      </label>
      <input
        type='text'
        required
        value={searchValue}
        placeholder='Search synonyms'
        onChange={handleInputChange}
        id='word-search-input'
        className='px-2 py-1 text-lg border rounded-md border-slate-300 dark:border-zinc-700 placeholder-slate-400 focus:outline-none focus:border-sky-600 focus:ring-sky-600 dark:focus:border-sky-600 dark:ring-sky-600 text-md focus:ring-1 '
      />
      <button type='submit' className='p-2 font-semibold rounded bg-sky-500 text-zinc-100 hover:bg-sky-700'>
        Search
      </button>
    </form>
  );
}
