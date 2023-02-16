import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* <Head>
        <title>React Playground</title>
        <meta name='description' content='A personal playground related to trying out react things' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head> */}
      <main className='min-h-screen p-6'>
        <h1 className='text-5xl font-semibold text-center'>React Playground</h1>
        <section className='grid grid-cols-5 gap-6 mt-14 w'>
          <article className='flex flex-col pb-2 overflow-hidden border shadow-lg dark:border-zinc-900 rounded-xl dark:bg-zinc-700 border-1 bg-zinc-200'>
            <Image
              src={"/assets/word-challenge.png"}
              alt='Word-Challenge'
              width={800}
              height={800}
              style={{ width: "100%", height: "240px", objectFit: "contain" }}
              className='bg-zinc-800'
              priority
            />
            <p className='inline-block px-4 py-2 mt-auto text-2xl font-semibold'>Word Challenge</p>
            <Link href={{ pathname: "/word-challenge" }} className='px-4 text-xl font-semibold dark:text-white'>
              View
            </Link>
          </article>
          <article className='flex flex-col pb-2 overflow-hidden border shadow-lg dark:border-zinc-900 rounded-xl dark:bg-zinc-700 border-1 bg-zinc-200'>
            <Image
              src={"/assets/file-challenge.png"}
              alt='File-Challenge'
              width={800}
              height={800}
              style={{ width: "100%", height: "240px", objectFit: "contain" }}
              className='bg-zinc-800'
              priority
            />
            <p className='inline-block px-4 py-2 mt-auto text-2xl font-semibold'>File Browser Challenge</p>
            <Link href={{ pathname: "/file-expand-challenge" }} className='px-4 text-xl font-semibold dark:text-white'>
              View
            </Link>
          </article>
        </section>
      </main>
    </>
  );
}
