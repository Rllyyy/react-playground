import { useState } from "react";
import { FileIcon, FolderIcon, MinusIcon, PlusIcon } from "./Icons";

type TEntry = {
  name: string;
  items?: TEntry[];
  count?: number;
};

export function Entry({ name, items, count }: TEntry) {
  const [showChildren, setShowChildren] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowChildren(!showChildren)}
        className='relative flex items-center gap-x-1 flew-row text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-100'
        style={{ marginLeft: `${(count || 0) * 10}px` }}
      >
        {/* Render plus or minus svg if the item (folder) has children */}
        {items && (!showChildren ? <PlusIcon /> : <MinusIcon />)}
        {/* Show file or folder (open or close) icon*/}
        {items ? <FolderIcon isOpen={showChildren} /> : <FileIcon />}
        {/* Show text */}
        <span className='text-lg'>{name}</span>
      </button>
      <>
        {showChildren &&
          items?.map((item, index) => {
            const { name, items } = item;

            return <Entry name={name} items={items} key={`${name}-${index}`} count={(count || 0) + 1} />;
          })}
      </>
    </>
  );
}
