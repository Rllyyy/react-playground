import React, { memo } from "react";
import useSWR, { MutatorOptions } from "swr";
import { fetcher } from "./posts";
import { motion } from "framer-motion";

export interface IPost {
  _id: string;
  databaseItemId?: string;
  postedAt: number;
  body: string;
  likes: Array<string>;
  user: {
    id: string;
    name: string;
    nickname: string;
    picture: string;
  };
}

async function deletePost({ _id }: { _id: NonNullable<IPost["_id"]> }): Promise<any> {
  try {
    const response = await fetch(`/api/chirp`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id }),
    });

    if (response.ok) {
      const responseJson = await response.json();
      //fetchData();
    } else {
      console.error(response.statusText);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}

function deletePostOptions({ _id }: { _id: NonNullable<IPost["_id"]> }): MutatorOptions {
  //const filteredItems =

  return {
    optimisticData: (posts: IPost[]) => posts.filter((post) => post._id !== _id),
    rollbackOnError: true,
    populateCache: (response, currentData) => currentData.filter((post: IPost) => post._id !== _id),
    revalidate: false,
  };
}

interface PostComponent {
  body: IPost["body"];
  likesCount: number;
  _id: IPost["_id"];
  postedAt: IPost["postedAt"];
  picture: IPost["user"]["picture"];
  nickname: IPost["user"]["nickname"];
  openModal: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const Post = ({ body, likesCount, _id, postedAt, picture, nickname, openModal }: PostComponent) => {
  const { mutate } = useSWR<IPost[], Error>("/api/chirp", fetcher);

  const handleItemDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (!_id) {
      console.error("_id");
      return;
    }

    await mutate(deletePost({ _id }), deletePostOptions({ _id }));
  };

  return (
    <motion.article
      className='flex flex-col px-4 py-3 bg-white rounded-lg gap-y-2 dark:bg-zinc-800 ring-1 ring-zinc-300 drop-shadow-sm dark:ring-0 dark:drop-shadow-none'
      layout
    >
      <div className='grid grid-cols-[45px_1fr_20px] gap-3'>
        <img
          loading='lazy'
          src={picture}
          alt='Profile picture'
          className='rounded-full place-self-center'
          width={45}
          height={45}
        />
        <div className='flex flex-col justify-between'>
          <p className='text-lg font-semibold'>{nickname}</p>
          <p className='text-sm text-zinc-500 dark:text-zinc-300'>
            {new Intl.DateTimeFormat("de-DE", {
              dateStyle: "short",
              timeStyle: "short",
            })
              .format(postedAt)
              .replace(",", "")}
          </p>
        </div>
      </div>
      <p>{body}</p>
      <div className='flex flex-row border-t-[1px] border-zinc-200 dark:border-zinc-600 pt-2 gap-x-2 '>
        <span className='mr-auto text-zinc-500 dark:text-zinc-300'>
          {likesCount} {likesCount === 1 ? "Like" : "Likes"}
        </span>
        <button>Like</button>
        {!_id.includes("-") && (
          <button data-id={_id} data-body={body} onClick={openModal}>
            Edit
          </button>
        )}
        {!_id.includes("-") && <button /* data-id={_id} */ onClick={handleItemDelete}>Delete</button>}
      </div>
    </motion.article>
  );
};
