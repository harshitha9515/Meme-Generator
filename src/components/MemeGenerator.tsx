import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, RefreshCw, Download, Share2, Loader2 } from "lucide-react";
import { MemeCanvas } from "./MemeCanvas";
import { TextEditor } from "./TextEditor";
import { MemeHistory } from "./MemeHistory";
import { ShareDialog } from "./ShareDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MemeData {
  id: string;
  imageUrl: string;
  topText: string;
  bottomText: string;
  topic: string;
  timestamp: number;
}

export interface TextStyle {
  fontSize: number;
  color: string;
  fontFamily: string;
  strokeColor: string;
  strokeWidth: number;
}

export const MemeGenerator = () => {
  const [topic, setTopic] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [textStyle, setTextStyle] = useState<TextStyle>({
    fontSize: 48,
    color: "#FFFFFF",
    fontFamily: "Impact",
    strokeColor: "#000000",
    strokeWidth: 3,
  });

  const fetchRandomMeme = async (searchTopic: string) => {
    try {
      const response = await fetch(`https://api.imgflip.com/get_memes`);
      const data = await response.json();
      
      if (data.success && data.data.memes.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.data.memes.length);
        return data.data.memes[randomIndex].url;
      }
      throw new Error("No memes found");
    } catch (error) {
      console.error("Error fetching meme:", error);
      throw error;
    }
  };

  const generateCaption = async (topic: string) => {
    const { data, error } = await supabase.functions.invoke("generate-meme-caption", {
      body: { topic },
    });

    if (error) {
      throw error;
    }

    return data.caption;
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    try {
      const [memeUrl, caption] = await Promise.all([
        fetchRandomMeme(topic),
        generateCaption(topic),
      ]);

      setImageUrl(memeUrl);
      
      const lines = caption.split("\n").filter((line: string) => line.trim());
      setTopText(lines[0] || caption);
      setBottomText(lines[1] || "");

      const newMeme: MemeData = {
        id: Date.now().toString(),
        imageUrl: memeUrl,
        topText: lines[0] || caption,
        bottomText: lines[1] || "",
        topic,
        timestamp: Date.now(),
      };

      const history = JSON.parse(localStorage.getItem("memeHistory") || "[]");
      localStorage.setItem("memeHistory", JSON.stringify([newMeme, ...history.slice(0, 9)]));

      toast.success("Meme generated successfully!");
    } catch (error) {
      console.error("Error generating meme:", error);
      toast.error("Failed to generate meme. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `meme-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Meme downloaded!");
    });
  };

  const loadMeme = (meme: MemeData) => {
    setImageUrl(meme.imageUrl);
    setTopText(meme.topText);
    setBottomText(meme.bottomText);
    setTopic(meme.topic);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
            AI Meme Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            Create viral memes with the power of AI
          </p>
        </div>

        <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border shadow-[var(--shadow-card)] backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Enter a topic (e.g., debugging, AI, startup life)..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
              className="flex-1 bg-background/50 border-border text-foreground text-lg"
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary-glow hover:to-accent text-primary-foreground font-semibold px-8 shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-neon)] transition-all duration-300 animate-glow-pulse"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Meme
                </>
              )}
            </Button>
          </div>
        </Card>

        {imageUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border shadow-[var(--shadow-card)]">
                <MemeCanvas
                  imageUrl={imageUrl}
                  topText={topText}
                  bottomText={bottomText}
                  textStyle={textStyle}
                />
              </Card>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Generate Another
                </Button>
                <Button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download
                </Button>
                <Button
                  onClick={() => setShareDialogOpen(true)}
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <TextEditor
                topText={topText}
                bottomText={bottomText}
                onTopTextChange={setTopText}
                onBottomTextChange={setBottomText}
                textStyle={textStyle}
                onTextStyleChange={setTextStyle}
              />
            </div>
          </div>
        )}

        <MemeHistory onLoadMeme={loadMeme} />

        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          memeData={{ imageUrl, topText, bottomText, topic }}
        />
      </div>
    </div>
  );
};
