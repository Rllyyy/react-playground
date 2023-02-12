import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import useSWR, { MutatorOptions } from "swr";
import { v4 as uuidv4 } from "uuid";
import { IPost } from "./post";
import { fetcher } from "./posts";
import { motion, spring } from "framer-motion";

const demoUser = {
  id: "6276d0c602ce122f7b8b11ec",
  name: "Jesse Hall",
  nickname: "demo_user",
  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
};

//TODO remove this fake delay

async function addPost(newPost: Omit<IPost, "_id">): Promise<any> {
  try {
    const response = await fetch("/api/chirp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });

    //TODO this is not enough!
    if (!response.ok) {
      console.log(response.statusText);
    } else {
      const responseJSON = await response.json();
      return responseJSON;
      //console.log(responseJSON);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }
  }
}

function addPostOptions(newPost: Omit<IPost, "_id">): MutatorOptions {
  return {
    optimisticData: (posts: IPost[]) => {
      //console.log(newPost);
      return [newPost, ...(posts || [])];
    },
    rollbackOnError: true,
    populateCache: (result, currentData) => {
      const postWithId = {
        ...newPost,
        _id: result.insertedId,
      };
      return [postWithId, ...(currentData || [])];
    },
    revalidate: false,
  };
}

export const CreatePost = () => {
  const { mutate } = useSWR<IPost[], Error>("/api/chirp", fetcher);

  const [textareaValue, setTextareaValue] = useState("");

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = textareaValue;

    // rest textarea
    setTextareaValue("");

    const now = Date.now();

    const newPost = {
      uid: `${uuidv4()}_${now}`,
      postedAt: now,
      body: value,
      likes: [],
      user: {
        id: demoUser.id,
        name: demoUser.name,
        nickname: demoUser.nickname,
        picture: demoUser.picture,
      },
    };

    await mutate(addPost(newPost), addPostOptions(newPost));
  };

  return (
    //!Needs to be protected by auth
    <form className='flex flex-row items-start w-full gap-x-3' onSubmit={handleSubmit}>
      <img
        src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        alt='Profile picture'
        className='p-1 rounded-full'
        width={40}
        height={40}
      />
      <TextareaAutosize
        className='flex-1 px-4 py-2 rounded-lg resize-none ring-zinc-300 ring-1 dark:ring-0 dark:focus:ring-0 dark:focus:border-0 dark:focus:outline-blue-700 focus:outline-blue-700 dark:focus:ring-blue-700 dark:focus:outline-none placeholder-zinc-500 dark:placeholder-zinc-400 dark:bg-zinc-800 dark:focus-visible:outline-offset-[0px]'
        value={textareaValue}
        onChange={handleTextareaChange}
        placeholder='Whats on your mind?'
        required
      />
      <button
        type='submit'
        className='w-full flex items-center justify-center font-semibold duration-150 bg-blue-700 rounded-lg hover:bg-blue-900 text-zinc-100 disabled:bg-zinc-500 max-w-[100px] h-10'
      >
        Post
      </button>
    </form>
  );
};
