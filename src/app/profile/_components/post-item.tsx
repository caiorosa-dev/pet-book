import { Heart, MessageCircle } from "lucide-react";

export default function PostItem() {
  return (
    <div className="w-full bg-secondary rounded-xl relative">
    <div className="absolute inset-0 flex items-center justify-center text-secondary gap-8 bg-accent-foreground/40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl">
      <div className="flex items-center gap-2">
        <Heart />5
      </div>
      <div className="flex items-center gap-2">
        <MessageCircle />1
      </div>
    </div>
      {/* <img src="https://www.shutterstock.com/image-photo/happy-puppy-welsh-corgi-14-600nw-2270841247.jpg" /> */}
      <img
        className="rounded-xl"
        src="https://hips.hearstapps.com/hmg-prod/images/golden-retriever-dog-royalty-free-image-505534037-1565105327.jpg?crop=0.760xw:1.00xh;0.204xw,0&resize=980:*"
      />
    </div>
  );
}
