interface commmentUserProps {
  pic: string;
}

export default function CommentUser({ pic }: commmentUserProps) {
  return (
    <div className="flex flex-row relative">
      <div className=" bg-red-600 w-6 h-6 rounded-full z-30 absolute right-8"></div>
      <div className=" bg-red-500 w-6 h-6 rounded-full z-40 absolute right-4"></div>
      <div className=" bg-red-400 w-6 h-6 rounded-full z-50 "></div>
    </div>
  );
}
