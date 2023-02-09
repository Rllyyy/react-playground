import TextareaAutosize from "react-textarea-autosize";
import React, { useState } from "react";
import { ComponentLoadingIcon } from "./componentLoadingIcon";
import { OpenModalItem } from "@/pages/chirp";
import { IPost } from "./post";
import { fetcher } from "./posts";
import useSWR, { MutatorOptions } from "swr";

//TODO remove this fake delay
const delay = () => new Promise<void>((resolve) => setTimeout(() => resolve(), 4000));

async function updatePost(updatedTweet: Pick<IPost, "_id" | "body">) {
  await delay();

  try {
    const data = await fetch("/api/chirp", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTweet),
    });

    if (data.ok) {
      return data.json();
    } else {
      console.error(data.statusText);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
  }
}

function updatePostOptions(updatePost: Pick<IPost, "_id" | "body">): MutatorOptions {
  return {
    optimisticData: (posts: IPost[]) => {
      return posts.map((post) => {
        if (post._id === updatePost._id) {
          return { ...post, body: updatePost.body };
        } else {
          return post;
        }
      });
    },
    rollbackOnError: true,
    populateCache: (result, currentData) => {
      return currentData.map((post: IPost) => {
        if (post._id === updatePost._id) {
          return { ...post, body: updatePost.body };
        } else {
          return post;
        }
      });
    },
    revalidate: false,
  };
}

/* upsertedId  */

export const EditModal = ({ target, closeModal }: { target: OpenModalItem | null; closeModal: () => void }) => {
  const [textareaValue, setTextareaValue] = useState(target?.body || "");

  const { mutate } = useSWR<IPost[], Error>("/api/chirp", fetcher);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!target || !target._id) return;

    const updatedTweet = { _id: target._id, body: textareaValue };

    closeModal();
    await mutate(updatePost(updatedTweet), updatePostOptions(updatedTweet));
  };

  return (
    <div>
      <div className='flex flex-row items-start justify-between'>
        <span className='mb-4 text-xl font-semibold'>Edit Item</span>
        <button onClick={closeModal}>
          <CloseIcon />
        </button>
      </div>
      <form className='flex flex-col items-end gap-3' onSubmit={handleSubmit}>
        <TextareaAutosize
          className='w-full p-2 rounded-lg resize-none ring-zinc-300 ring-1 dark:ring-1 dark:ring-zinc-500 dark:focus:ring-0 dark:focus:border-0 dark:focus-visible:outline-blue-700 focus:outline-blue-700 dark:focus:outline-none placeholder-zinc-500 dark:placeholder-zinc-400 dark:bg-zinc-700 required:invalid:ring-red-600 dark:focus-visible:outline-offset-[0px]'
          value={textareaValue}
          onChange={handleTextareaChange}
          placeholder='Edit item'
          required
        />
        <button
          className='h-10 font-semibold duration-150 bg-blue-700 rounded-lg w-full hover:bg-blue-900 text-zinc-100 max-w-[100px] flex items-center justify-center'
          /* disabled={loading} */
        >
          "Update"
        </button>
      </form>
    </div>
  );
};

const CloseIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='w-7 h-7 hover:text-red-600'
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
    </svg>
  );
};
