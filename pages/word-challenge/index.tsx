import { Form } from "@/components/word-challenge/form";
import { Results } from "@/components/word-challenge/results";

export default function WordChallenge() {
  return (
    <main className='flex flex-col items-center p-4 space-y-8'>
      <h1 className='text-3xl font-semibold'>Word Challenge</h1>
      <Form />
      <Results />
    </main>
  );
}
