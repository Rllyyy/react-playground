import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import useSWR, { MutatorOptions } from "swr";
import { v4 as uuidv4 } from "uuid";
import { IPost } from "./post";
import { fetcher } from "./posts";
import { useSession } from "next-auth/react";

const demoUser = {
  id: "6276d0c602ce122f7b8b11ec",
  name: "Jesse Hall",
  nickname: "demo_user",
  picture: "https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg",
};

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
  const { data: session, status } = useSession();
  const [textareaValue, setTextareaValue] = useState("");

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (status === "loading") return;

    e.preventDefault();

    const value = textareaValue;

    // rest textarea
    setTextareaValue("");

    let user;
    if (session && session.user._id) {
      user = {
        id: session.user._id,
        name: session.user.email || "anonymous@mail.com",
        nickname: session.user.name || "Anonymous",
        picture: session.user.image || "https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg",
      };
    } else {
      user = {
        id: demoUser.id,
        name: demoUser.name,
        nickname: demoUser.nickname,
        picture: demoUser.picture,
      };
    }

    const now = Date.now();

    const newPost = {
      uid: `${uuidv4()}_${now}`,
      postedAt: now,
      body: value,
      likes: [],
      user,
    };

    await mutate(addPost(newPost), addPostOptions(newPost));
  };

  return (
    //!Needs to be protected by auth
    <form className='flex flex-row items-start w-full gap-x-3' onSubmit={handleSubmit}>
      <img
        src={`${
          session?.user._id ? session.user.image : "https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg"
        }`}
        alt='Profile picture'
        className='p-1 rounded-full dark:bg-zinc-900 bg-zinc-300'
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
