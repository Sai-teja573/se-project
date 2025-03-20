import { useRef, useEffect, useState } from "react";
import { drawElement, drawConnection } from "@/lib/canvas";
import { nanoid } from "nanoid";

export function DiagramCanvas({ elements, connections, selectedTool, onElementsChange, onConnectionsChange, onDictionaryUpdate }) {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [connecting, setConnecting] = useState(null);

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

  const generateDictionaryEntry = (element) => {
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

  const handleMouseDown = (e) => {
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
      const newElement = {
        id: nanoid(),
        type: selectedTool,
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

  const handleMouseMove = (e) => {
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
      className="border border-primary/20 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}
