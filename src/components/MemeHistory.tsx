import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Trash2 } from "lucide-react";
import { MemeData } from "./MemeGenerator";
import { toast } from "sonner";

interface MemeHistoryProps {
  onLoadMeme: (meme: MemeData) => void;
}

export const MemeHistory = ({ onLoadMeme }: MemeHistoryProps) => {
  const [history, setHistory] = useState<MemeData[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const stored = localStorage.getItem("memeHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("memeHistory");
    setHistory([]);
    toast.success("History cleared");
  };

  if (history.length === 0) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border shadow-[var(--shadow-card)] animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Recent Memes
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={clearHistory}
          className="border-destructive text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear History
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {history.map((meme) => (
          <button
            key={meme.id}
            onClick={() => onLoadMeme(meme)}
            className="group relative aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:scale-105"
          >
            <img
              src={meme.imageUrl}
              alt={meme.topic}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-semibold truncate">
                  {meme.topic}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};
