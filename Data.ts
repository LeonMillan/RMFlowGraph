import fs from 'fs';
import { DataFilename, DataFilenameType, MapFilename, MapList } from './DataTypes';

function loadData<N extends DataFilename>(filename: N): DataFilenameType<N> {
    const fileContent = fs.readFileSync(`./data/${filename}.json`, { encoding: "utf8" });
    if (!fileContent) throw new Error(`Could not load file ${filename}`);
    try {
        const parsedData = JSON.parse(fileContent.trim());
        return parsedData;
    } catch (err: unknown) {
        console.error(`Failed to parse ${filename}`);
        throw err;
    }
}

export function loadGameData() {
    const database = {
        "CommonEvents": loadData("CommonEvents"),
        "MapInfos": loadData("MapInfos"),
        "System": loadData("System"),
    };
    const maps = database.MapInfos.map((mapInfo) => {
        if (!mapInfo) return null;
        const mapNum = mapInfo.id.toString().padStart(3, '0');
        const mapFilename = `Map${mapNum}` as MapFilename;
        return loadData(mapFilename);
    }) as MapList;
    return { database, maps };
}

export type FullGameData = ReturnType<typeof loadGameData>;
