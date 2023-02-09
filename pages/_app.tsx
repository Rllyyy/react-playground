import "@/styles/globals.css";
import { Navbar } from "@/components/navbar";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/chirp/sidebar";
import { PostsProvider } from "@/components/chirp/postsContext";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isChirp, setIsChirp] = useState(false);

  useEffect(() => {
    if (router.pathname.includes("/chirp")) {
      setIsChirp(true);
    } else {
      setIsChirp(false);
    }

    return () => {
      setIsChirp(false);
    };
  }, [router.pathname]);

  return (
    <>
      <Head>
        <title>React Playground</title>
        <meta name='description' content='A personal playground related to trying out react things' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <ThemeProvider enableSystem={true} attribute='class'>
        <Navbar />
        {!isChirp ? (
          <Component {...pageProps} />
        ) : (
          <PostsProvider>
            <div className='flex flex-col-reverse md:grid  md:grid-cols-[250px_1fr] h-[calc(100dvh_-_56px)] '>
              <Sidebar />
              <Component {...pageProps} />
            </div>
          </PostsProvider>
        )}
      </ThemeProvider>
    </>
  );
}
