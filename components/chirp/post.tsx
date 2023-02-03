import React from "react";

export interface IPost {
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

export const Post = ({
  item,
  openModal,
  fetchData,
}: {
  item: IPost;
  openModal: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  fetchData: () => Promise<void>;
}) => {
  const handleItemDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const _id = e.currentTarget.getAttribute("data-id");
    //console.log(JSON.stringify({ _id }));
    //return;

    if (!_id) return;

    //console.log(responseJson);
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
        fetchData();
      } else {
        console.error(response.statusText);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

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
        <button data-id={item._id} data-body={item.body} onClick={openModal}>
          Edit
        </button>
        <button data-id={item._id} onClick={handleItemDelete}>
          Delete
        </button>
      </div>
    </article>
  );
};