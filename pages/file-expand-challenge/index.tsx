import { useRef } from "react";
import { Entry } from "@/components/file-expand-challenge/Entry";
import { files } from "@/components/file-expand-challenge/files";

export default function WordChallenge() {
  // Setup Ref the keep track depth
  const count = useRef(0);

  return (
    <main className='flex flex-col items-center p-4 space-y-8'>
      <h1 className='text-3xl font-semibold'>File Expand Challenge</h1>
      <section className='relative flex flex-col px-8 mx-auto w-80'>
        {files.items.map((item) => {
          const { name, items } = item;
          return <Entry name={name} items={items} key={name} count={count.current} />;
        })}
      </section>
    </main>
  );
}
