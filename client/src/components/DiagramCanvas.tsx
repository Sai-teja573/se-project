import React, { useRef, useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { drawElement, drawConnection, drawTempConnection } from "../lib/canvas";
import { Element, Connection, DataDictionaryEntry } from "@shared/schema";

interface DiagramCanvasProps {
  elements: Element[];
  connections: Connection[];
  selectedTool: string | null;
  onElementsChange: (elements: Element[]) => void;
  onConnectionsChange: (connections: Connection[]) => void;
  onDictionaryUpdate?: (entry: DataDictionaryEntry) => void;
}

interface Point {
  x: number;
  y: number;
}

export function DiagramCanvas({
  elements,
  connections,
  selectedTool,
  onElementsChange,
  onConnectionsChange,
  onDictionaryUpdate,
}: DiagramCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [tempConnectionPoint, setTempConnectionPoint] = useState<Point | null>(null);

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
    
    // Draw temporary connection if we're in the middle of creating one
    if (connecting && tempConnectionPoint) {
      const fromElement = elements.find(e => e.id === connecting);
      if (fromElement) {
        drawTempConnection(ctx, fromElement, tempConnectionPoint);
      }
    }
  }, [elements, connections, connecting, tempConnectionPoint]);

  const generateDictionaryEntry = (element: Element): DataDictionaryEntry => {
    let description = "";
    switch (element.type) {
      case "bubble":
        description = `Process that handles ${element.text.toLowerCase()} operations`;
        break;
      case "entity":
        description = `External entity that interacts with ${element.text.toLowerCase()}`;
        break;
      case "datastore":
        description = `Storage for ${element.text.toLowerCase()} data`;
        break;
    }

    return {
      id: nanoid(),
      name: element.text,
      description,
    };
  };

  const findElementAtPosition = (x: number, y: number): Element | undefined => {
    return elements.find(element => {
      const dx = element.x - x;
      const dy = element.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 40;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking an existing element
    const clickedElement = findElementAtPosition(x, y);

    if (clickedElement) {
      if (selectedTool === "connect") {
        // Start a connection
        console.log(`Starting connection from: ${clickedElement.id}`);
        setConnecting(clickedElement.id);
        setTempConnectionPoint({ x, y });
      } else {
        // Start dragging the element
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

      // Generate and add dictionary entry
      if (onDictionaryUpdate) {
        onDictionaryUpdate(generateDictionaryEntry(newElement));
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (dragging) {
      // Update element position while dragging
      onElementsChange(
        elements.map(element =>
          element.id === dragging ? { ...element, x, y } : element
        )
      );
    } else if (connecting) {
      // Update temporary connection endpoint
      setTempConnectionPoint({ x, y });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // If we're creating a connection and releasing over another element
    if (connecting) {
      const targetElement = findElementAtPosition(x, y);
      
      // Don't connect to the same element or to no element
      if (targetElement && targetElement.id !== connecting) {
        // Create the connection
        onConnectionsChange([
          ...connections,
          {
            id: nanoid(),
            from: connecting,
            to: targetElement.id,
            type: "arrow"
          }
        ]);
      }
      
      // Reset connection state
      setConnecting(null);
      setTempConnectionPoint(null);
    }

    // Reset dragging state
    setDragging(null);
  };

  const handleMouseLeave = () => {
    // Reset states when mouse leaves the canvas
    if (connecting) {
      setConnecting(null);
      setTempConnectionPoint(null);
    }
    setDragging(null);
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="border border-primary/20 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    />
  );
}