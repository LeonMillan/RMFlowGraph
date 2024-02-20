/**
 * This is a minimal example of sigma. You can use it as a base to write new
 * examples, or reproducible test cases for new issues, for instance.
 */

import { MultiDirectedGraph } from "graphology";
import * as GraphLayouts from "graphology-layout";
import ForceAtlas2Worker from 'graphology-layout-forceatlas2/worker';
import Sigma from "sigma";
import EdgeArrowProgram from "sigma/rendering/programs/edge-arrow";
import NodeCircleProgram from "sigma/rendering/programs/node-circle";

import * as GraphJson from './graph.json';

const container = document.getElementById("sigma-container") as HTMLElement;

const graph = MultiDirectedGraph.from(GraphJson as any)

// Prepare layout
console.log("Setting up layout...");
GraphLayouts.circlepack.assign(graph, {
    hierarchyAttributes: ["community", "depth"],
    
});
const fa2Worker = new ForceAtlas2Worker(graph, { settings: {
    linLogMode: true,
    adjustSizes: true,
    gravity: 1,
    slowDown: 8,
} });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const renderer = new Sigma(graph, container, {
    renderEdgeLabels: true,
    edgeProgramClasses: {
        transport: EdgeArrowProgram,
    },
    nodeProgramClasses: {
        map: NodeCircleProgram,
    },
    maxCameraRatio: 2.5,
    minCameraRatio: 0.1,
});

interface IState {
    hoveredNode: string | null;
    hoveredNeighbors: Set<string> | null;
}
const state: IState = {
    hoveredNode: null,
    hoveredNeighbors: null,
};

function setHoveredNode(node?: string) {
  if (node) {
    state.hoveredNode = node;
    state.hoveredNeighbors = new Set(graph.neighbors(node));
  } else {
    state.hoveredNode = null;
    state.hoveredNeighbors = null;
  }

  // Refresh rendering:
  renderer.refresh();
}

renderer.on("enterNode", ({ node }) => {
  setHoveredNode(node);
});
renderer.on("leaveNode", () => {
  setHoveredNode(undefined);
});

renderer.setSetting("nodeReducer", (node, data) => {
  const res = { ...data };

  if (state.hoveredNeighbors && !state.hoveredNeighbors.has(node) && state.hoveredNode !== node) {
    res.label = "";
    res.color = "#f6f6f6";
  }

  return res;
});

renderer.setSetting("edgeReducer", (edge, data) => {
  const res = { ...data };

  if (state.hoveredNode && !graph.hasExtremity(edge, state.hoveredNode)) {
    res.hidden = true;
  }

  return res;
});


document.getElementById("toggle-force")?.addEventListener('click', () => {
    if (fa2Worker.isRunning()) {
        fa2Worker.stop();
    } else {
        fa2Worker.start();
    }
});

window.onload = () => {
    fa2Worker.start();
};