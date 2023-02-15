import React, { memo } from "react";
import useSWR, { MutatorOptions } from "swr";
import { fetcher } from "./posts";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export interface IPost {
  _id: string;
  uid: string;
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

export interface IPostDatabase extends IPost {
  _id: string;
}

async function deletePost({ uid }: { uid: NonNullable<IPostDatabase["uid"]> }): Promise<any> {
  try {
    const response = await fetch(`/api/chirp`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uid }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      const { error } = await response.json();
      throw new Error(`${error} (${response.status})`);
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
  }
}

function deletePostOptions({ uid }: { uid: NonNullable<IPost["uid"]> }): MutatorOptions {
  return {
    optimisticData: (posts: IPost[]) => posts.filter((post) => post.uid !== uid),
    rollbackOnError: true,
    populateCache: (response, currentData) => {
      if (!response.error) {
        return currentData.filter((post: IPost) => post.uid !== uid);
      } else {
        return currentData;
      }
    },
    revalidate: false,
  };
}

interface PostComponent {
  body: IPost["body"];
  likesCount: number;
  _id: IPost["_id"];
  uid: IPost["uid"];
  postedAt: IPost["postedAt"];
  userID: IPost["user"]["id"];
  picture: IPost["user"]["picture"];
  nickname: IPost["user"]["nickname"];
  openModal: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const Post: React.FC<PostComponent> = memo(
  ({ body, likesCount, uid, _id, postedAt, picture, nickname, openModal, userID }) => {
    const { mutate } = useSWR<IPost[], Error>("/api/chirp", fetcher);
    const { data: session, status } = useSession();

    const handleItemDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();

      if (!uid) {
        console.error("missing uid");
        return;
      }

      await mutate(deletePost({ uid }), deletePostOptions({ uid }));
    };

    return (
      <motion.article
        className='flex flex-col px-4 py-3 bg-white rounded-lg gap-y-2 dark:bg-zinc-800 ring-1 ring-zinc-300 drop-shadow-sm dark:ring-0 dark:drop-shadow-none'
        layout
        key={uid || _id}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0, transition: { delay: 0, duration: 0.1 } }}
        transition={{ delay: 0.3 }}
      >
        <div className='grid grid-cols-[45px_1fr] gap-3'>
          <img
            loading='lazy'
            src={picture}
            alt='Profile picture'
            className='rounded-full dark:bg-zinc-900 place-self-center bg-zinc-200'
            width={45}
            height={45}
          />
          <div className='flex flex-col justify-between'>
            <p className='text-lg font-semibold'>{nickname}</p>
            <time className='text-sm text-zinc-500 dark:text-zinc-400'>
              {new Intl.DateTimeFormat("de-DE", {
                dateStyle: "short",
                timeStyle: "short",
              })
                .format(postedAt)
                .replace(",", "")}
            </time>
          </div>
        </div>
        <p>{body}</p>
        <div className='flex flex-row border-t-[1px] border-zinc-200 dark:border-zinc-600 pt-2 gap-x-2 '>
          <span className='mr-auto text-zinc-500 dark:text-zinc-300'>
            {likesCount} {likesCount === 1 ? "Like" : "Likes"}
          </span>
          <button>Like</button>
          {status === "authenticated" && session.user._id === userID && (
            <>
              <button data-id={uid} data-body={body} onClick={openModal}>
                Edit
              </button>
              <button onClick={handleItemDelete}>Delete</button>
            </>
          )}
        </div>
      </motion.article>
    );
  }
);
