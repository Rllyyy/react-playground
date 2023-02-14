import useSWR from "swr";
import { AnimatePresence, motion } from "framer-motion";

import { LoadingIcon } from "./loadingIcon";
import { IPost, Post } from "./post";

interface Posts {
  openModal: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

interface SWRError extends Error {
  status: number;
}

export async function fetcher(url: string) {
  const res = await fetch(url);

  if (!res.ok) {
    const { error: message } = await res.json();
    const error = new Error(message) as SWRError;
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export const Posts = ({ openModal }: Posts) => {
  const { data: posts, isLoading, error } = useSWR<IPost[], SWRError>("/api/chirp", fetcher);

  if (isLoading) {
    return (
      <section className='flex flex-col gap-y-4'>
        {[...Array(16).keys()].map((item) => (
          <MockPost key={item} />
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <p>
        {error.status}: {error.message}
      </p>
    );
  }

  return (
    <motion.section layout className='flex flex-col gap-y-4'>
      <AnimatePresence initial={false}>
        {posts?.map((post) => {
          const {
            _id,
            uid,
            body,
            likes,
            postedAt,
            user: { id: userID, picture, nickname },
          } = post;
          return (
            <Post
              openModal={openModal}
              key={post.uid || post._id}
              uid={uid}
              _id={_id}
              body={body}
              likesCount={likes?.length}
              postedAt={postedAt}
              userID={userID}
              picture={picture}
              nickname={nickname}
            />
          );
        })}
      </AnimatePresence>
    </motion.section>
  );
};

const MockPost = () => {
  return (
    <div className='flex flex-col px-4 py-3 bg-white rounded-lg gap-y-4 dark:bg-zinc-800 ring-1 ring-zinc-300 drop-shadow-sm dark:ring-0 dark:drop-shadow-none'>
      <div className='flex flex-row gap-3'>
        <div className='w-[45px] h-[45px] bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse' />
        <div className='flex flex-col justify-between'>
          <div className='h-5 bg-gray-300 rounded-md dark:bg-gray-700 w-28 animate-pulse' />
          <div className='h-4 bg-gray-300 rounded-md dark:bg-gray-700 w-28 animate-pulse' />
        </div>
      </div>
      <div className='w-full h-6 bg-gray-300 rounded-md dark:bg-gray-700 animate-pulse' />
      <div className='flex flex-row justify-between gap-x-6'>
        <div className='w-12 h-5 bg-gray-300 rounded-md dark:bg-gray-700 animate-pulse' />
        <div className='w-full h-5 max-w-[100px] bg-gray-300 rounded-md dark:bg-gray-700 animate-pulse' />
      </div>
    </div>
  );
};
