import Graph from "graphology";
import * as GraphTraversal from 'graphology-traversal';
import GraphLouvain from 'graphology-communities-louvain';
import iwanthue from "iwanthue";

import { FullGameData } from "./Data";

export function fillMapNodes(graph: Graph, gameData: FullGameData) {
    const { database: { MapInfos } } = gameData;
    MapInfos.forEach((mapInfo) => {
        if (!mapInfo) return;
        const nodeName = `Map #${mapInfo.id}`;
        graph.addNode(nodeName, {
            type: 'map',
            label: mapInfo.name,
        });
    });
}

export function makeTeleportConnections(graph: Graph, gameData: FullGameData) {
    const { database: { MapInfos }, maps } = gameData;
    for (const mapInfo of MapInfos) {
        if (!mapInfo) continue;
        const map = maps[mapInfo.id]!;

        const connections: string[] = [];
        const source = `Map #${mapInfo.id}`;
        map.events.forEach((event) => {
            if (!event) return;
            event.pages.forEach((eventPage) => {
                const restriction = [
                    eventPage.conditions.actorValid && `Actor ${eventPage.conditions.actorId}`,
                    eventPage.conditions.itemValid && `Item ${eventPage.conditions.itemId}`,
                    eventPage.conditions.selfSwitchValid && `SelfSwitch ${eventPage.conditions.selfSwitchCh}`,
                    eventPage.conditions.switch1Valid && `Switch ${eventPage.conditions.switch1Id}`,
                    eventPage.conditions.switch2Valid && `Switch ${eventPage.conditions.switch2Id}`,
                    eventPage.conditions.variableValid && `Variable ${eventPage.conditions.variableId}>${eventPage.conditions.variableValue}`,
                ].filter((condition) => !!condition);
                const restrictTag = restriction.length ? restriction.join(',') : '';

                eventPage.list.forEach((command) => {
                    if (command.code === 201) {
                        const toMapId = command.parameters[1] as number;
                        const target = `Map #${toMapId}`;
                        const connectionKey = `${source} -> ${target} ${restrictTag}`.trim();
                        if (!graph.hasDirectedEdge(connectionKey)) {
                            graph.addDirectedEdgeWithKey(connectionKey, source, target, {
                                type: "transport",
                                label: restrictTag,
                                color: restrictTag ? "rgba(140, 44, 44, 0.4)" : "rgba(60, 60, 60, 0.6)",
                                size: 2,
                                restriction,
                            });
                            connections.push(connectionKey);
                        }
                    }
                });
            });
        });
        // connections.forEach((toMapId) => {
        //     const target = `Map #${toMapId}`;
        //     graph.addDirectedEdge(source, target, {
        //         type: "transport",
        //         color: "#666",
        //         radius: 40,
        //     });
        // });
        graph.updateNodeAttributes(source, (attr) => ({
            ...attr,
            size: 2 + Math.log2(1 + connections.length * 3),
        }))
    }
}

export function calculateCommunities(graph: Graph) {
    GraphLouvain.assign(graph);
    const louvain = GraphLouvain.detailed(graph);
    const palette = iwanthue(louvain.count);
    graph.updateEachNodeAttributes((node, attr) => ({
        ...attr,
        color: palette[attr.community],
    }));
}

export function makeNewGameNode(graph: Graph, gameData: FullGameData) {
    const { database: { System }, maps } = gameData;
    const startNode = `Map #${System.startMapId}`;

    graph.addNode("New Game", {
        type: 'map',
        label: "NEW GAME",
        depth: 0,
        size: 10,
        color: "#FF0000"
    })
    graph.addEdge("New Game", startNode);
}

export function calculateMapDepth(graph: Graph) {
    GraphTraversal.bfsFromNode(graph, "New Game", (node, _, depth) => {
        graph.updateNodeAttributes(node, (attr) => ({
            ...attr,
            depth,
        }));
    });
}
