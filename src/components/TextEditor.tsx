import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextStyle } from "./MemeGenerator";

interface TextEditorProps {
  topText: string;
  bottomText: string;
  onTopTextChange: (text: string) => void;
  onBottomTextChange: (text: string) => void;
  textStyle: TextStyle;
  onTextStyleChange: (style: TextStyle) => void;
}

export const TextEditor = ({
  topText,
  bottomText,
  onTopTextChange,
  onBottomTextChange,
  textStyle,
  onTextStyleChange,
}: TextEditorProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border shadow-[var(--shadow-card)] space-y-6">
      <h3 className="text-xl font-bold text-foreground">Customize Text</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topText" className="text-foreground">Top Text</Label>
          <Textarea
            id="topText"
            value={topText}
            onChange={(e) => onTopTextChange(e.target.value)}
            placeholder="Enter top text..."
            className="bg-background/50 border-border text-foreground resize-none"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bottomText" className="text-foreground">Bottom Text</Label>
          <Textarea
            id="bottomText"
            value={bottomText}
            onChange={(e) => onBottomTextChange(e.target.value)}
            placeholder="Enter bottom text..."
            className="bg-background/50 border-border text-foreground resize-none"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontSize" className="text-foreground">Font Size: {textStyle.fontSize}px</Label>
          <Slider
            id="fontSize"
            min={24}
            max={72}
            step={2}
            value={[textStyle.fontSize]}
            onValueChange={(value) =>
              onTextStyleChange({ ...textStyle, fontSize: value[0] })
            }
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontFamily" className="text-foreground">Font</Label>
          <Select
            value={textStyle.fontFamily}
            onValueChange={(value) =>
              onTextStyleChange({ ...textStyle, fontFamily: value })
            }
          >
            <SelectTrigger className="bg-background/50 border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Impact">Impact</SelectItem>
              <SelectItem value="Arial Black">Arial Black</SelectItem>
              <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
              <SelectItem value="Courier New">Courier New</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="textColor" className="text-foreground">Text Color</Label>
            <Input
              id="textColor"
              type="color"
              value={textStyle.color}
              onChange={(e) =>
                onTextStyleChange({ ...textStyle, color: e.target.value })
              }
              className="h-12 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strokeColor" className="text-foreground">Outline Color</Label>
            <Input
              id="strokeColor"
              type="color"
              value={textStyle.strokeColor}
              onChange={(e) =>
                onTextStyleChange({ ...textStyle, strokeColor: e.target.value })
              }
              className="h-12 cursor-pointer"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="strokeWidth" className="text-foreground">Outline Width: {textStyle.strokeWidth}px</Label>
          <Slider
            id="strokeWidth"
            min={0}
            max={10}
            step={1}
            value={[textStyle.strokeWidth]}
            onValueChange={(value) =>
              onTextStyleChange({ ...textStyle, strokeWidth: value[0] })
            }
            className="cursor-pointer"
          />
        </div>
      </div>
    </Card>
  );
};
