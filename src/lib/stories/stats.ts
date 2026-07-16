import type { StoryDefinition } from "./schema";

export type StoryStats = {
  nodeCount: number;
  choiceCount: number;
  endingCount: number;
  minimumRounds: number;
  maximumRounds: number;
  estimatedMinutes: number;
};

export function getStoryStats(story: StoryDefinition): StoryStats {
  const nodes = Object.values(story.nodes);
  const distances: number[] = [];

  function walk(nodeId: string, depth: number, visited: Set<string>) {
    if (visited.has(nodeId)) return;
    const node = story.nodes[nodeId];
    if (!node) return;

    const nextVisited = new Set(visited).add(nodeId);
    for (const choice of node.choices) {
      if (choice.nextNodeId === null) {
        distances.push(depth);
      } else {
        walk(choice.nextNodeId, depth + 1, nextVisited);
      }
    }
  }

  walk(story.startNodeId, 1, new Set());

  const choiceCount = nodes.reduce((total, node) => total + node.choices.length, 0);
  const endingCount = nodes.reduce(
    (total, node) => total + node.choices.filter((choice) => choice.nextNodeId === null).length,
    0,
  );
  const maximumRounds = distances.length ? Math.max(...distances) : 0;

  return {
    nodeCount: nodes.length,
    choiceCount,
    endingCount,
    minimumRounds: distances.length ? Math.min(...distances) : 0,
    maximumRounds,
    estimatedMinutes: Math.max(3, Math.ceil(maximumRounds * 1.25)),
  };
}
