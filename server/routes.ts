import type { Express } from "express";
import { createServer, Server } from "http";
import { storage } from "./storage";
import { insertDiagramSchema } from "@shared/schema";
import { z } from "zod";

interface ServerWithPort {
  server: Server;
  port: number;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/diagrams", async (_req, res) => {
    const diagrams = await storage.getAllDiagrams();
    res.json(diagrams);
  });

  app.get("/api/diagrams/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid diagram ID" });
    }

    const diagram = await storage.getDiagram(id);
    if (!diagram) {
      return res.status(404).json({ message: "Diagram not found" });
    }

    res.json(diagram);
  });

  app.post("/api/diagrams", async (req, res) => {
    try {
      const data = insertDiagramSchema.parse(req.body);
      const diagram = await storage.createDiagram(data);
      res.status(201).json(diagram);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid diagram data", errors: error.errors });
      }
      throw error;
    }
  });

  app.patch("/api/diagrams/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid diagram ID" });
    }

    try {
      const updates = insertDiagramSchema.partial().parse(req.body);
      const diagram = await storage.updateDiagram(id, updates);
      if (!diagram) {
        return res.status(404).json({ message: "Diagram not found" });
      }
      res.json(diagram);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid diagram data", errors: error.errors });
      }
      throw error;
    }
  });

  app.delete("/api/diagrams/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid diagram ID" });
    }

    const success = await storage.deleteDiagram(id);
    if (!success) {
      return res.status(404).json({ message: "Diagram not found" });
    }

    res.status(204).end();
  });

  const server = createServer(app);
  return server;
}

export async function startServer(
  server: Server, 
  initialPort: number = 5000,
  maxRetries = 3
): Promise<ServerWithPort> {
  let currentPort = initialPort;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      await new Promise<void>((resolve, reject) => {
        const onError = (error: Error & { code?: string }) => {
          if (error.code === 'EADDRINUSE') {
            server.removeListener('error', onError);
            currentPort++;
            retryCount++;
            console.log(`Port ${currentPort - 1} is in use, trying port ${currentPort}`);
            resolve();
          } else {
            reject(error);
          }
        };

        server.once('error', onError);
        
        server.listen(currentPort, '0.0.0.0', () => {
          server.removeListener('error', onError);
          console.log(`Server running on port ${currentPort}`);
          resolve();
        });
      });
      
      // If we get here without an error, the server started successfully
      return { server, port: currentPort };
    } catch (error) {
      // Handle any errors that weren't about the port being in use
      if (retryCount >= maxRetries) {
        throw new Error(`Could not start server after ${maxRetries} attempts: ${error}`);
      }
    }
  }
  
  throw new Error(`Could not find an available port after ${maxRetries} attempts`);
}
