import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DiagramCanvas } from "@/components/DiagramCanvas";
import { Toolbar } from "@/components/Toolbar";
import { DataDictionary } from "@/components/DataDictionary";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Editor() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/editor/:id");
  const { toast } = useToast();

  const [name, setName] = useState("Untitled Diagram");
  const [elements, setElements] = useState([]);
  const [connections, setConnections] = useState([]);
  const [dictionary, setDictionary] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);

  const { data: diagram } = useQuery({
    queryKey: ["/api/diagrams", params?.id],
    enabled: !!params?.id,
  });

  useEffect(() => {
    if (diagram) {
      setName(diagram.name);

      // Handle different possible structures of diagram data
      if (diagram.elements) {
        if (Array.isArray(diagram.elements)) {
          // If elements is an array, assume it contains the elements directly
          setElements(diagram.elements);
          setConnections(diagram.connections || []);
        } else if (diagram.elements.elements) {
          // If elements is an object with elements and connections properties
          setElements(diagram.elements.elements);
          setConnections(diagram.elements.connections || []);
        }
      } else {
        // Reset to empty arrays if no elements data
        setElements([]);
        setConnections([]);
      }

      setDictionary(diagram.dataDictionary || []);
    }
  }, [diagram]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        name,
        elements: { elements, connections },
        dataDictionary: dictionary,
      };

      if (params?.id) {
        return apiRequest("PATCH", `/api/diagrams/${params.id}`, data);
      } else {
        return apiRequest("POST", "/api/diagrams", data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/diagrams"] });
      toast({
        title: "Success",
        description: "Diagram saved successfully",
      });
      setLocation("/");
    },
  });

  const handleCheck = () => {
    const connectedElements = new Set(
      connections.flatMap(conn => [conn.from, conn.to])
    );

    const unconnected = elements.filter(el => !connectedElements.has(el.id));

    if (unconnected.length > 0) {
      toast({
        variant: "destructive",
        title: "Error Check Results",
        description: `Found ${unconnected.length} unconnected elements: ${unconnected.map(el => el.text).join(", ")}`,
      });
    } else {
      toast({
        title: "Error Check Results",
        description: "All elements are properly connected!",
      });
    }
  };

  const handleDictionaryUpdate = (entry) => {
    setDictionary(prev => [...prev, entry]);
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen bg-gradient-to-b from-background to-primary/5">
      <div className="mb-6">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-3xl font-bold w-full bg-transparent border-none focus-visible:ring-primary/20 placeholder:text-foreground/50"
          placeholder="Enter diagram name..."
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2">
          <Card className="sticky top-8">
            <CardContent className="p-0">
              <Toolbar
                selectedTool={selectedTool}
                onToolSelect={setSelectedTool}
                onSave={() => saveMutation.mutate()}
                onCheck={handleCheck}
              />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-7">
          <DiagramCanvas
            elements={elements}
            connections={connections}
            selectedTool={selectedTool}
            onElementsChange={setElements}
            onConnectionsChange={setConnections}
            onDictionaryUpdate={handleDictionaryUpdate}
          />
        </div>

        <div className="col-span-3">
          <Card className="sticky top-8">
            <CardContent>
              <DataDictionary
                entries={dictionary}
                onEntriesChange={setDictionary}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
