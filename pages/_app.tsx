import "@/styles/globals.css";
import { Navbar } from "@/components/navbar";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "next-themes";

export default function App({ Component, pageProps }: AppProps) {
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
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
