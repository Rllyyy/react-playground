import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface IPost {
  _id: string;
  postedAt: Date;
  body: string;
  likes: Array<string>;
  user: {
    id: string;
    name: string;
    nickname: string;
    picture: string;
  };
}

export default function ChirpHome() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/chirp");
    const json = await res.json();
    setPosts(json);
    setLoading(false);
  }, []);

  // Try this with swr maybe
  useEffect(() => {
    fetchData();

    return () => {
      setPosts([]);
      setLoading(true);
    };
  }, [fetchData]);

  if (loading) {
    return <LoadingIcon />;
  }

  return (
    <>
      <Head>
        <title>Chirp</title>
        <meta name='description' content='A social media clone' />
      </Head>
      <main className='p-6 space-y-6 overflow-y-scroll duration-200 bg-zinc-100 dark:bg-zinc-700'>
        <CreatePost fetchData={fetchData} />
        {posts.map((post) => {
          return <Post item={post} key={post._id} />;
        })}
      </main>
    </>
  );
}

const demoUser = {
  id: "6276d0c602ce122f7b8b11ec",
  name: "Jesse Hall",
  nickname: "codestackr",
  picture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
};

const CreatePost = ({ fetchData }: { fetchData: () => Promise<void> }) => {
  const [textareaValue, setTextareaValue] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setInputDisabled(true);

    const newPost = {
      postedAt: Date.now(),
      body: textareaValue,
      likes: [],
      user: {
        id: demoUser.id,
        name: demoUser.name,
        nickname: demoUser.nickname,
        picture: demoUser.picture,
      },
    };

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
        console.log(responseJSON);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
    }

    // refetch data
    fetchData();

    // rest textarea
    setTextareaValue("");

    // enable button again
    setInputDisabled(false);
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
        className='flex-1 px-4 py-2 rounded-lg resize-none ring-zinc-300 ring-1 dark:ring-0 dark:focus:ring-0 dark:focus:border-0 dark:focus:outline-blue-700 focus:outline-blue-700 dark:focus:ring-blue-700 dark:focus:outline-none placeholder-zinc-500 dark:placeholder-zinc-400 dark:bg-zinc-800'
        value={textareaValue}
        onChange={handleTextareaChange}
        placeholder='Whats on your mind?'
      />
      <button
        type='submit'
        className='px-8 py-2 font-semibold duration-150 bg-blue-700 rounded-lg hover:bg-blue-900 text-zinc-100 disabled:bg-zinc-500'
        disabled={inputDisabled}
      >
        Post
      </button>
    </form>
  );
};

const Post = ({ item }: { item: IPost }) => {
  return (
    <article className='flex flex-col px-4 py-3 bg-white rounded-lg gap-y-2 dark:bg-zinc-800 ring-1 ring-zinc-300 drop-shadow-sm dark:ring-0 dark:drop-shadow-none'>
      <div className='grid grid-cols-[45px_1fr_20px] gap-3'>
        <img
          loading='lazy'
          src={item.user.picture}
          alt='Profile picture'
          className='rounded-full place-self-center'
          width={45}
          height={45}
        />
        <div className='flex flex-col justify-between'>
          <p className='text-lg font-semibold'>{item.user.nickname}</p>
          <p className='text-sm text-zinc-500 dark:text-zinc-300'>{new Date(item.postedAt).toLocaleString()}</p>
        </div>
      </div>
      <p>{item.body}</p>
      <div className='flex flex-row border-t-[1px] border-zinc-200 dark:border-zinc-600 pt-2 gap-x-2 '>
        <span className='mr-auto text-zinc-500 dark:text-zinc-300'>
          {item.likes.length} {item.likes.length === 1 ? "Like" : "Likes"}
        </span>
        <button>Like</button>
        <button>Share</button>
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </article>
  );
};

const LoadingIcon = () => {
  return (
    <div className='ml-auto mr-auto mt-[40vh]'>
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
    </div>
  );
};
