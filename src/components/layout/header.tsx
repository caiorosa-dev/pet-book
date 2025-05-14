import { Logo } from "@/components/misc/logo";
import { Button } from "@/components/ui/button";
import { MapPin, MessagesSquare } from "lucide-react";

export function Header({ className }: { className: string }) {
  const currentLocation: string = "Itajaí, SC";

  return (
    <div className={className ?? "flex items-center justify-between p-4"}>
      <Logo />
      <div className="flex items-center">
        <Button className="bg-transparent hover:bg-accent">
          <MapPin className="text-primary" />
        </Button>
        <span className="mx-4">{currentLocation}</span>
        <Button className="bg-transparent hover:bg-accent">
          <MessagesSquare className="text-primary" />
        </Button>
      </div>
    </div>
  );
}
