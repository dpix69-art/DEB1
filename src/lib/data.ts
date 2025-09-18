import { Module, Card } from '../types';

// Import all JSON files from /data directory
const dataModules = import.meta.glob('/data/*.json', { eager: true });

export function getModules(): Module[] {
  const modules: Module[] = [];
  
  Object.entries(dataModules).forEach(([path, moduleData]) => {
    const filename = path.split('/').pop()?.replace('.json', '') || '';
    const moduleId = filename;
    const moduleName = filename
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const cards = (moduleData as { default: Card[] }).default;
    
    modules.push({
      id: moduleId,
      name: moduleName,
      cards: cards || []
    });
  });
  
  return modules.sort((a, b) => a.name.localeCompare(b.name));
}

export function getModule(moduleId: string): Module | null {
  const modules = getModules();
  return modules.find(m => m.id === moduleId) || null;
}

export function getCard(moduleId: string, cardId: string): { module: Module; card: Card } | null {
  const module = getModule(moduleId);
  if (!module) return null;
  
  const card = module.cards.find(c => c.id === cardId);
  if (!card) return null;
  
  return { module, card };
}