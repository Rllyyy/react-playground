import { LoadingIcon } from "./loadingIcon";
import { IPost, Post } from "./post";

interface Posts {
  posts: IPost[];
  openModal: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  fetchData: () => Promise<void>;
  postsLoading: boolean;
}

export const Posts = ({ posts, openModal, fetchData, postsLoading }: Posts) => {
  if (postsLoading) {
    return <LoadingIcon />;
  }

  return (
    <>
      {posts.map((post) => {
        return <Post item={post} key={post._id} openModal={openModal} fetchData={fetchData} />;
      })}
    </>
  );
};
