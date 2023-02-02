import { CreatePost } from "@/components/chirp/createPost";
import { LoadingIcon } from "@/components/chirp/loadingIcon";
import { IPost, Post } from "@/components/chirp/post";
import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";
import TextareaAutosize from "react-textarea-autosize";

type OpenModalItem = {
  _id: string | null;
  body: string | null;
};

export default function ChirpHome() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState<OpenModalItem | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
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

  function openModal(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setModalIsOpen({ _id: e.currentTarget.getAttribute("data-id"), body: e.currentTarget.getAttribute("data-body") });
  }

  function closeModal() {
    setModalIsOpen(null);
  }

  if (loading) {
    return <LoadingIcon />;
  }

  Modal.setAppElement("#__next");

  return (
    <>
      <Head>
        <title>Chirp</title>
        <meta name='description' content='A social media clone' />
      </Head>
      <main className='p-6 space-y-6 overflow-y-scroll duration-200 bg-zinc-100 dark:bg-zinc-700'>
        <CreatePost fetchData={fetchData} />
        {posts.map((post) => {
          return <Post item={post} key={post._id} openModal={openModal} />;
        })}
        <Modal
          isOpen={!!modalIsOpen}
          onRequestClose={closeModal}
          className='w-full max-w-screen-lg p-4 bg-white rounded-lg dark:bg-zinc-800'
          style={{
            overlay: {
              backgroundColor: "rgba(63, 63, 70, .8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
            },
          }}
        >
          <EditModal target={modalIsOpen} closeModal={closeModal} fetchData={fetchData} />
        </Modal>
      </main>
    </>
  );
}

const EditModal = ({
  target,
  closeModal,
  fetchData,
}: {
  target: OpenModalItem | null;
  closeModal: () => void;
  fetchData: () => Promise<void>;
}) => {
  const [textareaValue, setTextareaValue] = useState(target?.body || "");
  const [loading, setLoading] = useState(false);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!target) return;

    setLoading(true);

    const updatedTweet = { _id: target._id, body: textareaValue };

    try {
      const data = await fetch("/api/chirp", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTweet),
      });

      setLoading(false);

      if (data.ok) {
        // close modal and refetch data
        closeModal();
        fetchData();
        return;
      } else {
        console.error(data.statusText);
      }
    } catch (error) {
      console.error(error);
    }
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
          disabled={loading}
        >
          {!loading ? "Update" : <LoadingIcon2 />}
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

const LoadingIcon2 = () => {
  return (
    <div role='status' className=''>
      <svg
        aria-hidden='true'
        className='inline w-6 h-6 text-zinc-400 fill-zinc-100 animate-spin'
        viewBox='0 0 100 101'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
          fill='currentColor'
        />
        <path
          d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
          fill='currentFill'
        />
      </svg>
      <span className='sr-only'>Loading...</span>
    </div>
  );
};
