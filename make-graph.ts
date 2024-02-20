import { MultiDirectedGraph } from "graphology";
import process from 'node:process';
import fs from 'fs';

import { loadGameData } from "./Data";
import * as MapGraph from "./MapGraph";

// Load necessary data
console.log("Loading data...");
const graph = new MultiDirectedGraph();
const gameData = loadGameData();

// Create the graph
console.log("Creating graph...");
MapGraph.fillMapNodes(graph, gameData);
MapGraph.makeTeleportConnections(graph, gameData);
MapGraph.calculateCommunities(graph);
MapGraph.makeNewGameNode(graph, gameData);
MapGraph.calculateMapDepth(graph);

// Prepare layout
console.log("Setting up layout...");

graph.updateEachNodeAttributes((node, attr) => {
    return {
        ...attr,
    }
});

// Export
console.log("Exporting...");
const graphJson = graph.export();
if (fs.existsSync("graph.json")) fs.rmSync("graph.json");
fs.writeFileSync("graph.json", JSON.stringify(graphJson), { encoding: 'utf8', flush: true });

process.exit(0);