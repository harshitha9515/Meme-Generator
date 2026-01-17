import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Twitter, Linkedin, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memeData: {
    imageUrl: string;
    topText: string;
    bottomText: string;
    topic: string;
  };
}

export const ShareDialog = ({ open, onOpenChange, memeData }: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);

  const generateHashtags = (topic: string) => {
    const hashtags = ["#AIMemes", "#TechHumor", "#DevLife"];
    const topicTag = `#${topic.replace(/\s+/g, "")}`;
    return [...hashtags, topicTag].join(" ");
  };

  const shareText = `${memeData.topText}\n${memeData.bottomText}\n\n${generateHashtags(memeData.topic)}`;

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Share Your Meme</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-foreground">Caption with Hashtags</Label>
            <div className="relative">
              <Input
                value={shareText}
                readOnly
                className="bg-background/50 border-border text-foreground pr-12"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-foreground">Share On</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleTwitterShare}
                className="bg-gradient-to-r from-[#1DA1F2] to-[#1a8cd8] hover:from-[#1a8cd8] hover:to-[#1DA1F2] text-white"
              >
                <Twitter className="mr-2 h-5 w-5" />
                Twitter / X
              </Button>
              <Button
                onClick={handleLinkedInShare}
                className="bg-gradient-to-r from-[#0077B5] to-[#006396] hover:from-[#006396] hover:to-[#0077B5] text-white"
              >
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
