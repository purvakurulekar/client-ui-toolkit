import { IQuaternion } from "./src/Utils"

interface IDropZoneProps {
    onItemDrop(ev: React.DragEvent): void,
    onLeave(ev: React.DragEvent): void
}

declare enum SLIDER_DIRECTION {
    vertical = "vertical",
    horizontal = "horizontal"
}

export interface ISlidingPanelProps {
    className?: string,
    direction?: SLIDER_DIRECTION, // up or down
    initialDimension?: number,
    minDimension?: number,
    configKey?: string,
    children?: any,
    isCollapsable?: boolean,
    isCollapsed?: boolean,
    isResizable?: boolean,
    onCollapseToggle?(isCollapse: boolean): void
}

interface IHeaderProps {
    isLoggedIn: boolean,
    onLoginStatechanged: Function,
    onProfileToggle: Function
}

interface IFooterProps {
    children?: JSX.Element | Array<JSX.Element>,
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
    width?: number,
    height?: number
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

interface ISwitchToggleProps {
    label?: string;
    mode?: string; // boring | normal
    checked: boolean;
    disabled?: boolean;
    onChange(ev: React.ChangeEvent<HTMLInputElement>): void;
}

interface ISettingsButton {
    onClick?(): void,
    onOpen?(): void,
    onClose?(): void
    children?: any
}

declare class Utils {
    static degToRad(deg: number): number;
    static radToDeg(rad: number): number;
    static eulerToQuaternion(eulerAngleInDeg: Vector3): IQuaternion;// pitch (x), roll (y), yaw (z)
    static genGUID(): string;
    static genUUID(size: number): string;
    static cloneObj(object: Object): Object;
    static millisToString(timeInMillis: number): string;
    static debounce(funcToDebounce: Function, debounceTime: number): Function;
}

export function importCiCAPI(url: string): Promise<void>;
export function SlidingPanel(props: ISlidingPanelProps): JSX.Element;
export function TestAppHeader(props: IHeaderProps): JSX.Element;
export function TestAppFooter(props: IFooterProps): JSX.Element;
export function SettingsPanel(props: ISettingsPanelProps): JSX.Element;
export function Loader(props: ILoaderProps): JSX.Element;
export function Overlay(props: IOverlayProps): JSX.Element;
export function DropZone(props: IDropZoneProps): JSX.Element;
export function PCSSniffer(): JSX.Element;
export function SwitchToggle(props: ISwitchToggleProps): JSX.Element;
export function SettingsButton(props: ISettingsButton): JSX.Element;
export { SLIDER_DIRECTION };
export { Utils }
