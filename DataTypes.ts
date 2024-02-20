/**
 * Common: Basic
 */

export type DatabaseArray<T> = [null, ...T[]];


/**
 * Common: Events
 */

export interface IEventCommand {
    code: number;
    indent: number;
    parameters: unknown[];
}

export type EventList = Array<IEventCommand>;


/**
 * System.json
 */

export interface ISystemVehicle {
    startX: number;
    startY: number;
    startMapId: number;
}

export interface ISystem {
    airship: ISystemVehicle;
    ship: ISystemVehicle;
    boat: ISystemVehicle;
    gameTitle: string;
    optDisplayTp: boolean;
    optFloorDeath: boolean;
    optSlipDeath: boolean;
    partyMembers: number[];
    startMapId: number;
    startX: number;
    startY: number;
}

export type SystemJson = ISystem;


/**
 * Items.json
 */

export enum ItemType {
    Regular,
    KeyItem,
    HiddenA,
    HiddenB,
}

export interface IItem {
    id: number;
    name: string;
    itypeId: ItemType;
}

export type ItemsJson = DatabaseArray<IItem>;


/**
 * Enemies.json
 */

export interface IEnemyDropItem {
    dataId: number;
    kind: number;
    denominator: number;
}

export interface IEnemyTrait {
    code: number;
    dataId: number;
    value: number;
}

export interface IEnemy {
    id: number;
    name: string;
    dropItems: IEnemyDropItem[];
    traits: IEnemyTrait[];
}

export type EnemiesJson = DatabaseArray<IEnemy>;

/**
 * MapInfos.json
 */

export interface IMapInfo {
    id: number;
    name: string;
}

export type MapInfosJson = DatabaseArray<IMapInfo>;


/**
 * Map###.json
 */

export enum MapEventTrigger {
    ActionButton,
    PlayerTouch,
    EventTouch,
    Autorun,
    Parallel,
}

export interface IMapEncounter {

}

export interface IMapEventPage {
    conditions: {
        actorValid: boolean;
        actorId: number;
        itemValid: boolean;
        itemId: number;
        selfSwitchValid: boolean;
        selfSwitchCh: string;
        switch1Valid: boolean;
        switch1Id: number;
        switch2Valid: boolean;
        switch2Id: number;
        variableValid: boolean;
        variableId: number;
        variableValue: number;
    };
    list: EventList;
    trigger: MapEventTrigger;
}

export interface IMapEvent {
    id: number;
    name: string;
    pages: Array<IMapEventPage>;
}

export interface IMap {
    displayName: string;
    encounterList: Array<unknown>;
    events: DatabaseArray<IMapEvent>;
}

export type MapJson = IMap;


/**
 * CommonEvents.json
 */

export enum CommonEventTrigger {
    None,
    Autorun,
    Parallel,
}

export interface ICommonEvent {
    id: number;
    name: string;
    switchId: number;
    trigger: CommonEventTrigger;
}

export type CommonEventsJson = DatabaseArray<ICommonEvent>;


/**
 * Files
 */

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type MapFilename = `Map${Digit}${Digit}${Digit}`;
export type FilenameToDataType = {
    "CommonEvents": CommonEventsJson;
    "MapInfos": MapInfosJson;
    "System": SystemJson;
} & {
    [key in MapFilename]: MapJson;
}

export type DataFilename = keyof FilenameToDataType;
export type DataFilenameType<Name extends DataFilename> = FilenameToDataType[Name];
export type MapList = [null, ...MapJson[]];
