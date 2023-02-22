import Image from "next/image";
import Link from "next/link";

const items = [
  {
    name: "Word Challenge",
    imageSrc: "/assets/word-challenge.png",
    imageAlt: "Word-Challenge",
    link: "/word-challenge",
  },
  {
    name: "Word Challenge",
    imageSrc: "/assets/file-challenge.png",
    imageAlt: "File Browser Challenge-",
    link: "/file-expand-challenge",
  },
  {
    name: "Chirp",
    imageSrc: "/assets/chirp.png",
    imageAlt: "chirp.png",
    link: "/chirp",
  },
];

export default function Home() {
  return (
    <>
      <main className='min-h-screen p-6'>
        <h1 className='text-5xl font-semibold text-center'>React Playground</h1>
        <section className='grid grid-cols-5 gap-6 mt-14 w'>
          {items.map((item, index) => {
            return (
              <article
                className='flex flex-col pb-2 overflow-hidden border shadow-lg dark:border-zinc-900 rounded-xl dark:bg-zinc-700 border-1 bg-zinc-200'
                key={index}
              >
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  width={800}
                  height={800}
                  className='object-contain w-full bg-zinc-800 h-60'
                  priority
                />
                <p className='inline-block px-4 py-2 mt-auto text-2xl font-semibold'>{item.name}</p>
                <Link href={{ pathname: item.link }} className='px-4 text-xl font-semibold dark:text-white'>
                  View
                </Link>
              </article>
            );
          })}
        </section>
      </main>
    </>
  );
}
