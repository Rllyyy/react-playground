import { CreatePost } from "@/components/chirp/createPost";
import { EditModal } from "@/components/chirp/EditModal";
import { Posts } from "@/components/chirp/posts";
import { motion } from "framer-motion";
import Head from "next/head";
import React, { useState } from "react";
import Modal from "react-modal";

export type OpenModalItem = {
  uid: string | null;
  body: string | null;
};

export default function ChirpHome() {
  const [modalIsOpen, setModalIsOpen] = useState<OpenModalItem | null>(null);

  function openModal(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setModalIsOpen({ uid: e.currentTarget.getAttribute("data-id"), body: e.currentTarget.getAttribute("data-body") });
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
      <motion.main className='p-4 space-y-4 overflow-y-scroll duration-200 md:space-y-6 md:p-6 bg-zinc-100 dark:bg-zinc-700'>
        <CreatePost />
        <Posts openModal={openModal} />
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
          <EditModal target={modalIsOpen} closeModal={closeModal} />
        </Modal>
      </motion.main>
    </>
  );
}

//TODO - remove context
