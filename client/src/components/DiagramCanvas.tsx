import { useRef, useEffect, useState } from "react";
import { drawElement, drawConnection } from "@/lib/canvas";
import { Element, Connection } from "@shared/schema";
import { nanoid } from "nanoid";

interface DiagramCanvasProps {
  elements: Element[];
  connections: Connection[];
  selectedTool: string | null;
  onElementsChange: (elements: Element[]) => void;
  onConnectionsChange: (connections: Connection[]) => void;
}

export function DiagramCanvas({
  elements,
  connections,
  selectedTool,
  onElementsChange,
  onConnectionsChange,
}: DiagramCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all elements
    elements.forEach(element => drawElement(ctx, element));
    connections.forEach(connection => drawConnection(ctx, connection, elements));
  }, [elements, connections]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking an existing element
    const clickedElement = elements.find(element => {
      const dx = element.x - x;
      const dy = element.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 40;
    });

    if (clickedElement) {
      if (connecting) {
        // Complete connection
        onConnectionsChange([
          ...connections,
          {
            id: nanoid(),
            from: connecting,
            to: clickedElement.id,
            type: "arrow"
          }
        ]);
        setConnecting(null);
      } else if (selectedTool === "connect") {
        setConnecting(clickedElement.id);
      } else {
        setDragging(clickedElement.id);
      }
    } else if (selectedTool && selectedTool !== "connect") {
      // Create new element
      const newElement: Element = {
        id: nanoid(),
        type: selectedTool as Element["type"],
        x,
        y,
        text: `New ${selectedTool}`
      };
      onElementsChange([...elements, newElement]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onElementsChange(
      elements.map(element =>
        element.id === dragging ? { ...element, x, y } : element
      )
    );
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="border border-gray-300 rounded-lg bg-white"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}
