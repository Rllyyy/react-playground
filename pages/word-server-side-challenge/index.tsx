import { Form } from "@/components/word-server-side-challenge/form";
import { IItem, Results } from "@/components/word-server-side-challenge/results";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { ParsedUrlQuery } from "querystring";

export default function WordChallenge({
  words,
  error,
  searchValue,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className='flex flex-col items-center p-4 space-y-8'>
      <h1 className='text-3xl font-semibold'>Word Challenge</h1>
      <Form searchValue={searchValue} />
      <Results results={words} error={error} />
    </main>
  );
}

interface IParms extends ParsedUrlQuery {
  value?: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const { value } = query as IParms;

  if (!value) {
    return {
      props: {
        words: null,
      },
    };
  }

  const apiURL = "https://api.datamuse.com";
  const urlWord = value?.replaceAll(" ", "+");

  // Try block to catch any errors thrown by the fetch function
  try {
    // Send a request to the specified URL and get the response
    const res = await fetch(`${apiURL}/words?ml=${urlWord}&max=50`);

    // If the response is successful (status code in the range 200-299)
    if (res.ok) {
      // Parse the response body as JSON
      const data: IItem[] | undefined = await res.json();

      // Return the data as props
      return {
        props: {
          words: data,
          searchValue: value,
        },
      };
    } else {
      // If the response is not successful, return an error message as props
      return {
        props: {
          error: res.statusText,
          searchValue: value,
        },
      };
    }
  } catch (error) {
    // If there was an error thrown by the fetch function, return the error message as props

    if (error instanceof Error) {
      return {
        props: {
          error: `${error.message}`,
          searchValue: value,
        },
      };
    }
  }
}
