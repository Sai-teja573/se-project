import { createServer } from "http";
import { storage } from "./storage.js";
import { z } from "zod";
import { DiagramDataSchema } from "../shared/schema.js";

export async function registerRoutes(app) {
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
      const data = DiagramDataSchema.parse(req.body);
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
      const updates = DiagramDataSchema.partial().parse(req.body);
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

  return createServer(app);
}
