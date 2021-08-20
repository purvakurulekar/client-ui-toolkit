
declare enum SLIDER_DIRECTION {
    vertical = "vertical",
    horizontal = "horizontal"
}

interface ISlidingPanelProps {
    className?: string,
    direction?: SLIDER_DIRECTION, // up or down
    initialDimension?: number,
    configKey?: string,
    children: any
}

interface IHeaderProps {
    isLoggedIn: boolean,
    onLoginStatechanged: Function,
    onProfileToggle: Function
}

interface IFooterProps {
    onSettingsToggled: Function
}

interface ISettingsPanelProps {
    label?: string,
    path?: string,
    value?: string,
    onChange?: Function,
    onClose?: Function
}

interface ILoaderProps {
    width?:number,
    height?:number
}

interface IOverlayProps {
    children?: any
}

interface ILoggerStore {
    logs: Array<ILogEntry>,
    onChangeCallbacks: Set<Function>
}

interface IAvgTimings {
    min: number,
    avg: number,
    max: number
}

declare enum LOG_TYPE_ENUM {
    network = 0,
    trace = 1
}

interface ILogEntry {
    msg: string;
    time: number;
    data: string;
    type: LOG_TYPE_ENUM;
}


declare class Logger {
    registerToChanges(callback: Function): void;
    unregisterToChanges(callback: Function): void;
    getLogs(type?: LOG_TYPE_ENUM): Array<ILogEntry>;
    getLastLog(type?: LOG_TYPE_ENUM): ILogEntry | null;
    getAvgLogTimings(type?: LOG_TYPE_ENUM): IAvgTimings;
    add(type: LOG_TYPE_ENUM, msg: string, time?: number, data?: string): void;
    reset(): void;
}

declare class Utils {
    static degToRad(deg: number): number;
    static radToDeg(rad: number): number;
    static eulerToQuaternion(eulerAngleInDeg: ILCVector3): IQuaternion;// pitch (x), roll (y), yaw (z)
    static genGUID(): string;
    static genUUID(size: number): string;
    static cloneObj(object: Object): Object;
    static millisToString(timeInMillis: number): string;
    static debounce(funcToDebounce: Function, debounceTime: number): Function;
}

export function importCiCAPI(url: string): Promise<void>;
export function SlidingPanel(props:ISlidingPanelProps): JSX.Element;
export function TestAppHeader(props:IHeaderProps): JSX.Element;
export function TestAppFooter(props:IFooterProps): JSX.Element;
export function DataSourceControl(): JSX.Element;
export function SettingsPanel(props: ISettingsPanelProps): JSX.Element;
export function Loader(props: ILoaderProps): JSX.Element;
export function Overlay(props: IOverlayProps): JSX.Element;
export function PCSSniffer(): JSX.Element;
export { SLIDER_DIRECTION };
export { Logger, Utils }
