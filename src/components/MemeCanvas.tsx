import { useEffect, useRef } from "react";
import { TextStyle } from "./MemeGenerator";

interface MemeCanvasProps {
  imageUrl: string;
  topText: string;
  bottomText: string;
  textStyle: TextStyle;
}

export const MemeCanvas = ({ imageUrl, topText, bottomText, textStyle }: MemeCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      ctx.font = `bold ${textStyle.fontSize}px ${textStyle.fontFamily}`;
      ctx.fillStyle = textStyle.color;
      ctx.strokeStyle = textStyle.strokeColor;
      ctx.lineWidth = textStyle.strokeWidth;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      const maxWidth = canvas.width - 40;

      const wrapText = (text: string, maxWidth: number) => {
        const words = text.split(" ");
        const lines: string[] = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = ctx.measureText(currentLine + " " + word).width;
          if (width < maxWidth) {
            currentLine += " " + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);
        return lines;
      };

      if (topText) {
        const topLines = wrapText(topText.toUpperCase(), maxWidth);
        topLines.forEach((line, index) => {
          const y = 40 + index * (textStyle.fontSize + 10);
          ctx.strokeText(line, canvas.width / 2, y);
          ctx.fillText(line, canvas.width / 2, y);
        });
      }

      if (bottomText) {
        const bottomLines = wrapText(bottomText.toUpperCase(), maxWidth);
        bottomLines.forEach((line, index) => {
          const y = canvas.height - (bottomLines.length - index) * (textStyle.fontSize + 10) - 40;
          ctx.strokeText(line, canvas.width / 2, y);
          ctx.fillText(line, canvas.width / 2, y);
        });
      }
    };

    img.src = imageUrl;
  }, [imageUrl, topText, bottomText, textStyle]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto rounded-lg shadow-[var(--shadow-neon)] border border-primary/20"
      />
    </div>
  );
};
