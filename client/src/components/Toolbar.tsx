import { Button } from "@/components/ui/button";
import { Circle, Square, Database, ArrowRight } from "lucide-react";

interface ToolbarProps {
  selectedTool: string | null;
  onToolSelect: (tool: string | null) => void;
  onSave: () => void;
  onCheck: () => void;
}

export function Toolbar({ selectedTool, onToolSelect, onSave, onCheck }: ToolbarProps) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-white border border-gray-200 rounded-lg">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Drawing Tools</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={selectedTool === "bubble" ? "default" : "outline"}
            size="sm"
            onClick={() => onToolSelect(selectedTool === "bubble" ? null : "bubble")}
          >
            <Circle className="w-4 h-4 mr-2" />
            Bubble
          </Button>
          <Button
            variant={selectedTool === "entity" ? "default" : "outline"}
            size="sm"
            onClick={() => onToolSelect(selectedTool === "entity" ? null : "entity")}
          >
            <Square className="w-4 h-4 mr-2" />
            Entity
          </Button>
          <Button
            variant={selectedTool === "datastore" ? "default" : "outline"}
            size="sm"
            onClick={() => onToolSelect(selectedTool === "datastore" ? null : "datastore")}
          >
            <Database className="w-4 h-4 mr-2" />
            Data Store
          </Button>
          <Button
            variant={selectedTool === "connect" ? "default" : "outline"}
            size="sm"
            onClick={() => onToolSelect(selectedTool === "connect" ? null : "connect")}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Connect
          </Button>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <h3 className="text-sm font-medium">Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onSave}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onCheck}
          >
            Check
          </Button>
        </div>
      </div>
    </div>
  );
}
