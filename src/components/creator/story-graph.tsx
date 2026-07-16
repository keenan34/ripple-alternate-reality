"use client";

import {
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { Flag, Play } from "lucide-react";
import { useMemo } from "react";

import type { CreatorDraft, NodePosition } from "@/lib/creator/drafts";
import type { StoryChoice, StoryNode } from "@/lib/stories/schema";

type StoryGraphData = { node: StoryNode; isStart: boolean; selectedChoiceId: string | null } & Record<string, unknown>;
type StoryGraphNode = Node<StoryGraphData, "story">;

export function StoryGraph({
  draft,
  selectedNodeId,
  selectedChoiceId,
  onSelect,
  onMove,
  onConnect,
}: {
  draft: CreatorDraft;
  selectedNodeId: string;
  selectedChoiceId: string | null;
  onSelect: (nodeId: string, choiceId?: string) => void;
  onMove: (nodeId: string, position: NodePosition) => void;
  onConnect: (nodeId: string, choiceId: string, targetNodeId: string) => void;
}) {
  const nodes = useMemo<StoryGraphNode[]>(() => Object.values(draft.story.nodes).map((node, index) => ({
    id: node.id,
    type: "story",
    position: draft.layout[node.id] ?? { x: 70 + (index % 3) * 320, y: 80 + Math.floor(index / 3) * 240 },
    selected: selectedNodeId === node.id,
    data: { node, isStart: draft.story.startNodeId === node.id, selectedChoiceId },
  })), [draft, selectedChoiceId, selectedNodeId]);

  const edges = useMemo<Edge[]>(() => Object.values(draft.story.nodes).flatMap((node) => node.choices.flatMap((choice) => choice.nextNodeId ? [{
    id: `${node.id}-${choice.id}-${choice.nextNodeId}`,
    source: node.id,
    sourceHandle: choice.id,
    target: choice.nextNodeId,
    label: choice.label,
    markerEnd: { type: MarkerType.ArrowClosed },
    className: "story-edge",
  }] : [])), [draft.story.nodes]);

  function connect(connection: Connection) {
    if (connection.source && connection.sourceHandle && connection.target) {
      onConnect(connection.source, connection.sourceHandle, connection.target);
    }
  }

  return (
    <div className="story-graph" data-testid="story-graph">
      <ReactFlow<StoryGraphNode>
        nodes={nodes}
        edges={edges}
        nodeTypes={{ story: GraphNode }}
        onNodeClick={(_, graphNode) => onSelect(graphNode.id)}
        onNodeDragStop={(_, graphNode) => onMove(graphNode.id, graphNode.position)}
        onConnect={connect}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.35}
        maxZoom={1.5}
        deleteKeyCode={null}
      >
        <Background gap={24} size={1} color="rgba(242,236,223,.1)" />
        <MiniMap nodeColor={(node) => node.id === draft.story.startNodeId ? "#de661f" : "#428f88"} pannable zoomable />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

function GraphNode({ data }: NodeProps<StoryGraphNode>) {
  return (
    <div className="graph-story-node">
      <Handle type="target" position={Position.Left} />
      <header>
        <span>{data.isStart ? <Play size={11} fill="currentColor" /> : <Flag size={11} />}{data.isStart ? " Start" : data.node.kind}</span>
        <strong>{data.node.year}</strong>
      </header>
      <h3>{data.node.question}</h3>
      <div className="graph-choice-list">
        {data.node.choices.map((choice: StoryChoice) => (
          <div className={data.selectedChoiceId === choice.id ? "active" : ""} key={choice.id}>
            <span>{choice.label}</span>
            <Handle id={choice.id} type="source" position={Position.Right} />
          </div>
        ))}
      </div>
    </div>
  );
}
