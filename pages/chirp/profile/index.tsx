import { LoadingIcon } from "@/components/chirp/loadingIcon";
import { ProfileAuthenticated, ProfileUnauthenticated } from "@/components/chirp/profile";
import { useSession } from "next-auth/react";
import Head from "next/head";

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingIcon />;
  }

  return (
    <>
      <Head>
        <title>Chirp</title>
      </Head>
      <main className='flex justify-center p-8 mb-auto'>
        {status === "authenticated" ? (
          <ProfileAuthenticated
            userImage={session?.user.image}
            userName={session?.user.name}
            userEmail={session?.user.email}
          />
        ) : (
          <ProfileUnauthenticated />
        )}
      </main>
    </>
  );
}
