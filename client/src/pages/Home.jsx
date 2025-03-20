import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FileEdit, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  const { data: diagrams, isLoading } = useQuery({
    queryKey: ["/api/diagrams"],
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">CASE Tool</h1>
          <p className="text-gray-600">
            Create and manage your software design diagrams
          </p>
        </div>
        <Link href="/editor">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Diagram
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diagrams?.map((diagram) => (
            <Link key={diagram.id} href={`/editor/${diagram.id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileEdit className="w-5 h-5" />
                    {diagram.name}
                  </CardTitle>
                  <CardDescription>
                    {`${diagram.elements.length} elements`}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
