import { diagrams, type Diagram, type InsertDiagram } from "@shared/schema";

export interface IStorage {
  getDiagram(id: number): Promise<Diagram | undefined>;
  getAllDiagrams(): Promise<Diagram[]>;
  createDiagram(diagram: InsertDiagram): Promise<Diagram>;
  updateDiagram(id: number, diagram: Partial<InsertDiagram>): Promise<Diagram | undefined>;
  deleteDiagram(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private diagrams: Map<number, Diagram>;
  private currentId: number;

  constructor() {
    this.diagrams = new Map();
    this.currentId = 1;
  }

  async getDiagram(id: number): Promise<Diagram | undefined> {
    return this.diagrams.get(id);
  }

  async getAllDiagrams(): Promise<Diagram[]> {
    return Array.from(this.diagrams.values());
  }

  async createDiagram(insertDiagram: InsertDiagram): Promise<Diagram> {
    const id = this.currentId++;
    const diagram: Diagram = { ...insertDiagram, id };
    this.diagrams.set(id, diagram);
    return diagram;
  }

  async updateDiagram(id: number, updates: Partial<InsertDiagram>): Promise<Diagram | undefined> {
    const existing = await this.getDiagram(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.diagrams.set(id, updated);
    return updated;
  }

  async deleteDiagram(id: number): Promise<boolean> {
    return this.diagrams.delete(id);
  }
}

export const storage = new MemStorage();
