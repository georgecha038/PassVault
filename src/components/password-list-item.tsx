import type { PasswordEntry } from "@/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PasswordListItemProps {
  password: PasswordEntry;
  onView: () => void;
}

export default function PasswordListItem({ password, onView }: PasswordListItemProps) {
  const getFaviconUrl = (url: string) => {
    try {
      const urlObject = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=64`;
    } catch (error) {
      return `https://www.google.com/s2/favicons?domain=${password.website}&sz=64`;
    }
  };

  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || 'S';
  }

  return (
    <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4 transition-colors hover:bg-secondary/50">
      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
        <Avatar>
          <AvatarImage src={getFaviconUrl(password.website)} alt={password.siteName} />
          <AvatarFallback>{getInitials(password.siteName)}</AvatarFallback>
        </Avatar>
        <div className="truncate">
          <p className="font-semibold truncate">{password.siteName}</p>
          <p className="text-sm text-muted-foreground truncate">{password.username}</p>
        </div>
      </div>
      <Button variant="outline" onClick={onView} size="sm">
        View
      </Button>
    </div>
  );
}
