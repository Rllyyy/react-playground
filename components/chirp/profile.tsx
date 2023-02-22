import { signIn, useSession } from "next-auth/react";
import { Session } from "next-auth";

interface IProfile {
  userImage: Session["user"]["image"];
  userName: Session["user"]["name"];
  userEmail: Session["user"]["email"];
}

export const ProfileAuthenticated: React.FC<IProfile> = ({ userImage, userName, userEmail }) => {
  return (
    <div className='flex flex-col items-center w-full max-w-2xl min-h-full p-4 rounded-lg border-[1px] dark:border-gray-800 gap-y-2 bg-zinc-50 dark:bg-zinc-700 '>
      {userImage && <img src={userImage} alt={`Profile Image of ${userName}`} className='max-w-[60px] rounded-full' />}
      <p className='text-xl font-semibold'>{userName}</p>
      <p>{userEmail}</p>
    </div>
  );
};

export const ProfileUnauthenticated = () => {
  return (
    <div className='flex flex-col items-center justify-center h-full gap-y-2'>
      <p className='text-xl'>Please Login to view your Profile</p>
      <button
        onClick={() => signIn()}
        className='w-full max-w-[150px] px-4 py-2 text-xl font-semibold bg-blue-600 rounded-lg text-zinc-50 hover:bg-blue-700'
      >
        Login
      </button>
    </div>
  );
};
