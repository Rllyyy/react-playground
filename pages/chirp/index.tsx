import { CreatePost } from "@/components/chirp/createPost";
import { EditModal } from "@/components/chirp/EditModal";
import { IPost } from "@/components/chirp/post";
import { Posts } from "@/components/chirp/posts";
import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "react-modal";

export type OpenModalItem = {
  _id: string | null;
  body: string | null;
};

export default function ChirpHome() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState<OpenModalItem | null>(null);

  const fetchData = useCallback(async () => {
    setPostsLoading(true);
    const res = await fetch("/api/chirp");
    const json = await res.json();
    setPosts(json);
    setPostsLoading(false);
  }, []);

  // Try this with swr maybe
  useEffect(() => {
    fetchData();

    return () => {
      setPosts([]);
      setPostsLoading(true);
    };
  }, [fetchData]);

  function openModal(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setModalIsOpen({ _id: e.currentTarget.getAttribute("data-id"), body: e.currentTarget.getAttribute("data-body") });
  }

  function closeModal() {
    setModalIsOpen(null);
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
        <Posts posts={posts} openModal={openModal} fetchData={fetchData} postsLoading={postsLoading} />
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
