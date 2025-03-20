export class MemStorage {
  constructor() {
    this.diagrams = new Map();
    this.currentId = 1;
  }

  async getDiagram(id) {
    return this.diagrams.get(id);
  }

  async getAllDiagrams() {
    return Array.from(this.diagrams.values());
  }

  async createDiagram(insertDiagram) {
    const id = this.currentId++;
    const diagram = { ...insertDiagram, id };
    this.diagrams.set(id, diagram);
    return diagram;
  }

  async updateDiagram(id, updates) {
    const existing = await this.getDiagram(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.diagrams.set(id, updated);
    return updated;
  }

  async deleteDiagram(id) {
    return this.diagrams.delete(id);
  }
}

export const storage = new MemStorage();
