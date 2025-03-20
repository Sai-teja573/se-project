import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DiagramCanvas } from "@/components/DiagramCanvas";
import { Toolbar } from "@/components/Toolbar";
import { DataDictionary } from "@/components/DataDictionary";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Element, Connection, DataDictionaryEntry, Diagram } from "@shared/schema";
import { Input } from "@/components/ui/input";

export default function Editor() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/editor/:id");
  const { toast } = useToast();
  
  const [name, setName] = useState("Untitled Diagram");
  const [elements, setElements] = useState<Element[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [dictionary, setDictionary] = useState<DataDictionaryEntry[]>([]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const { data: diagram } = useQuery<Diagram>({
    queryKey: ["/api/diagrams", params?.id],
    enabled: !!params?.id,
  });

  useEffect(() => {
    if (diagram) {
      setName(diagram.name);
      setElements((diagram.elements as any).elements);
      setConnections((diagram.elements as any).connections);
      setDictionary((diagram.dataDictionary as any));
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
    // Simple error checking - verify all elements are connected
    const connectedElements = new Set(
      connections.flatMap(conn => [conn.from, conn.to])
    );
    
    const unconnected = elements.filter(el => !connectedElements.has(el.id));
    
    if (unconnected.length > 0) {
      toast({
        variant: "destructive",
        title: "Error Check Results",
        description: `Found ${unconnected.length} unconnected elements`,
      });
    } else {
      toast({
        title: "Error Check Results",
        description: "No errors found",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-2xl font-bold w-full"
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-2">
          <Toolbar
            selectedTool={selectedTool}
            onToolSelect={setSelectedTool}
            onSave={() => saveMutation.mutate()}
            onCheck={handleCheck}
          />
        </div>

        <div className="col-span-7">
          <DiagramCanvas
            elements={elements}
            connections={connections}
            selectedTool={selectedTool}
            onElementsChange={setElements}
            onConnectionsChange={setConnections}
          />
        </div>

        <div className="col-span-3">
          <DataDictionary
            entries={dictionary}
            onEntriesChange={setDictionary}
          />
        </div>
      </div>
    </div>
  );
}
