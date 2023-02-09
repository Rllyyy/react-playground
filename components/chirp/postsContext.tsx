import React, { createContext, useMemo, useState } from "react";
import { IPost } from "./post";

export interface IPostsContext {
  posts: IPost[];
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
}

export const PostsContext = createContext({ posts: [], setPosts: () => {} } as IPostsContext);

type Props = {
  children: React.ReactNode;
};

export const PostsProvider: React.FC<Props> = ({ children }) => {
  const [items, setItems] = useState<IPost[]>([]);

  const memoedPosts = useMemo(() => ({ items, setItems }), [items]);

  return (
    <PostsContext.Provider value={{ posts: memoedPosts.items, setPosts: memoedPosts.setItems }}>
      {children}
    </PostsContext.Provider>
  );
};
