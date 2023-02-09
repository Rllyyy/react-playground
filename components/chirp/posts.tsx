import useSWR from "swr";
import { motion } from "framer-motion";

import { LoadingIcon } from "./loadingIcon";
import { IPost, Post } from "./post";

interface Posts {
  openModal: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const fetcher = (url: string) => fetch(url).then((r) => r.json());

export const Posts = ({ openModal }: Posts) => {
  const { data: posts, isLoading, error } = useSWR<IPost[], Error>("/api/chirp", fetcher);

  if (isLoading) {
    return <LoadingIcon />;
  }

  if (error) {
    return <p>{error.stack}</p>;
  }

  return (
    <motion.section layout className='flex flex-col gap-y-4'>
      {posts?.map((post) => {
        const {
          _id,
          body,
          likes,
          postedAt,
          user: { picture, nickname },
        } = post;
        return (
          <Post
            /*item={post}   */
            openModal={openModal}
            key={post._id}
            _id={_id}
            body={body}
            likesCount={likes?.length}
            postedAt={postedAt}
            picture={picture}
            nickname={nickname}
          />
        );
      })}
    </motion.section>
  );
};
