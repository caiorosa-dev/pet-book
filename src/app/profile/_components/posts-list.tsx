import PostItem from "./post-item";

export default function PostsList() {
  return (
    <div className="flex flex-col gap-4 mt-12">
      <h1 className="text-x1">Seus Posts</h1>
      <div className="grid grid-cols-2 gap-4">
        <PostItem />
        <PostItem />
        <PostItem />
        <PostItem />
        <PostItem />
        <PostItem />
      </div>
    </div>
  );
}
