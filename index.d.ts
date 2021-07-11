
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

interface ILoaderProps {
    width?:number,
    height?:number
}

interface IOverlayProps {
    children?: any
}

export function SlidingPanel(props:ISlidingPanelProps): JSX.Element;
export function Header(props:IHeaderProps): JSX.Element;
export function Loader(props: ILoaderProps): JSX.Element;
export function Overlay(props: IOverlayProps): JSX.Element;
export function PCSSniffer(): JSX.Element;
export { SLIDER_DIRECTION };
