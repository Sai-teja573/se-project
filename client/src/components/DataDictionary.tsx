import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DataDictionaryEntry } from "@shared/schema";
import { nanoid } from "nanoid";
import { Plus, Trash2 } from "lucide-react";

interface DataDictionaryProps {
  entries: DataDictionaryEntry[];
  onEntriesChange: (entries: DataDictionaryEntry[]) => void;
}

export function DataDictionary({ entries, onEntriesChange }: DataDictionaryProps) {
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;

    onEntriesChange([
      ...entries,
      {
        id: nanoid(),
        name: newName,
        description: newDescription
      }
    ]);

    setNewName("");
    setNewDescription("");
  };

  const handleDelete = (id: string) => {
    onEntriesChange(entries.filter(entry => entry.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Data Dictionary</h3>
        <div className="grid gap-2">
          <Input
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Textarea
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={2}
          />
          <Button onClick={handleAdd} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {entries.map(entry => (
          <div
            key={entry.id}
            className="p-3 border rounded-md bg-white flex items-start justify-between gap-2"
          >
            <div className="flex-1">
              <h4 className="font-medium">{entry.name}</h4>
              <p className="text-sm text-gray-600">{entry.description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(entry.id)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
