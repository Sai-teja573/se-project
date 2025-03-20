import { Button } from "@/components/ui/button";
import { Circle, Square, Database, ArrowRight, Save, CheckCircle } from "lucide-react";

interface ToolbarProps {
  selectedTool: string | null;
  onToolSelect: (tool: string | null) => void;
  onSave: () => void;
  onCheck: () => void;
}

export function Toolbar({ selectedTool, onToolSelect, onSave, onCheck }: ToolbarProps) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-primary">Drawing Tools</h3>
        <div className="grid gap-2">
          <Button
            variant={selectedTool === "bubble" ? "default" : "outline"}
            size="sm"
            onClick={() => onToolSelect(selectedTool === "bubble" ? null : "bubble")}
            className="w-full justify-start hover:bg-primary/10"
          >
            <Circle className="w-4 h-4 mr-2" />
            Process
          </Button>
          <Button
            variant={selectedTool === "entity" ? "default" : "outline"}
            size="sm"
            onClick={() => onToolSelect(selectedTool === "entity" ? null : "entity")}
            className="w-full justify-start hover:bg-primary/10"
          >
            <Square className="w-4 h-4 mr-2" />
            Entity
          </Button>
          <Button
            variant={selectedTool === "datastore" ? "default" : "outline"}
            size="sm"
            onClick={() => onToolSelect(selectedTool === "datastore" ? null : "datastore")}
            className="w-full justify-start hover:bg-primary/10"
          >
            <Database className="w-4 h-4 mr-2" />
            Data Store
          </Button>
          <Button
            variant={selectedTool === "connect" ? "default" : "outline"}
            size="sm"
            onClick={() => onToolSelect(selectedTool === "connect" ? null : "connect")}
            className="w-full justify-start hover:bg-primary/10"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Connect
          </Button>
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-3">
        <h3 className="text-sm font-medium text-primary">Actions</h3>
        <div className="grid gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={onSave}
            className="w-full justify-start bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onCheck}
            className="w-full justify-start"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Validate
          </Button>
        </div>
      </div>
    </div>
  );
}