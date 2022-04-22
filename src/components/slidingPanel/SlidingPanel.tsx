import React, { useState, useRef, useEffect, CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines, faGripLinesVertical, faCaretLeft, faCaretRight, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import "./slidingPanel.scss";

const
    STORAGE_COLLAPSED_SUFFIX = "-col";

export enum SLIDER_DIRECTION {
    vertical = "vertical",
    horizontal = "horizontal"
}

export interface ISlidingPanelProps {
    className?: string,
    direction?: SLIDER_DIRECTION, // up or down
    initialDimension?: number,
    minDimension?: number,
    configKey?: string,
    disabled?: boolean,
    children: any,
    isResizable?: boolean,
    isCollapsable?: boolean,
    isCollapsed?: boolean,
    onCollapseToggle?(isCollapse: boolean): void
}

let onMouseMoveFunc: Function | null = null,
    onMouseUpFunc: Function | null = null;

export default function SlidingPanel(props: ISlidingPanelProps) {
    let [dimension, setDimension] = useState((props.configKey && Number(localStorage.getItem(props.configKey))) || props.initialDimension || 0),
        [isCollapsed, setCollapsed] = useState(props.isCollapsed !== undefined ? /true/.test(String(localStorage.getItem(props.configKey + STORAGE_COLLAPSED_SUFFIX))) : Boolean(props.isCollapsed)), // 
        panelRef = useRef(),
        classNames = ["sliding-panel"],
        isResizable: boolean = props.isResizable || props.isResizable === undefined,
        resizerIcon,
        resizerWidget,
        collapseToggleIcon,
        collapseToggleBtn,
        style: CSSProperties = {
        },
        onMouseDown: React.MouseEventHandler<HTMLDivElement> | undefined;

    if (props.direction === SLIDER_DIRECTION.vertical) {
        Object.assign(style, { height: dimension + "px" });
        resizerIcon = faGripLines;
        classNames.push("vertical-slider");
    } else {
        Object.assign(style, { width: dimension + "px" });
        resizerIcon = faGripLinesVertical;
        classNames.push("horizontal-slider");
    }

    if (isResizable) {
        classNames.push("sliding-panel-resizable");
        onMouseDown = (e: React.MouseEvent) => {
            let startAxisValue: number;

            if (onMouseUpFunc !== null || onMouseMoveFunc !== null) {
                window.removeEventListener("mousemove", onMouseMoveFunc as any);
                window.removeEventListener("mouseup", onMouseUpFunc as any);
            }

            if (props.direction === SLIDER_DIRECTION.vertical) {
                startAxisValue = e.clientY;
            } else {
                startAxisValue = e.clientX;
            }

            // if (dimension === "auto") {
            //     // @ts-ignore
            //     dimension = (panelRef.current as HTMLDivElement).getBoundingClientRect().height;
            // }

            // @ts-ignore
            onMouseMoveFunc = _windowMouseMoveFunc.bind(null, props.direction as string, startAxisValue, dimension, setDimension, panelRef.current);
            onMouseUpFunc = _windowMouseUpFunc.bind(null);

            window.addEventListener("mousemove", onMouseMoveFunc as any);
            window.addEventListener("mouseup", onMouseUpFunc as any);
        };
        resizerWidget = (
            <div className="sliding-panel-btn-container" onMouseDown={onMouseDown}>
                {!props.isCollapsable && <FontAwesomeIcon icon={resizerIcon} />}
            </div>
        );

    } else {
        classNames.push("sliding-panel-fixed");
    }

    useEffect(() => {
        if (props.configKey) {
            let storedWidth: number = Number(localStorage.getItem(props.configKey));
            if (!isNaN(storedWidth)) {
                setDimension(storedWidth);
            } else if (props.initialDimension) {
                setDimension(props.initialDimension);
            }

            let storedCollapsedState: string | null = localStorage.getItem(props.configKey + STORAGE_COLLAPSED_SUFFIX),
                collapsedState: boolean;

            if (storedCollapsedState !== null) {
                collapsedState = /true/.test(storedCollapsedState);

                setCollapsed(collapsedState);
                if (props.onCollapseToggle) {
                    props.onCollapseToggle(collapsedState);
                }
            } else {
                collapsedState = true;
            }
        }
    }, []);

    useEffect(() => {
        let updatedDimension: number = Number(dimension);

        if (updatedDimension > 0) {
            if (panelRef && panelRef.current) {
                let boundingRect = (panelRef?.current as unknown as HTMLDivElement)?.getBoundingClientRect();

                if (props.direction === SLIDER_DIRECTION.vertical && boundingRect.height < dimension) {
                    updatedDimension = Math.round(boundingRect.height);
                } else if (boundingRect.width < dimension) {
                    updatedDimension = Math.round(boundingRect.width);
                }
            }

            if (props.configKey && !isCollapsed) {
                localStorage.setItem(props.configKey, updatedDimension.toString());
            }

            setDimension(updatedDimension);
        }
    }, [dimension]);

    // useEffect(() => {
    //     console.log("UE CHANGED IS COLLAPSED: ", props.isCollapsed);
    //     if (props.isCollapsed !== undefined) {
    //         setCollapsed(props.isCollapsed)
    //     }
    // }, [props.isCollapsed]);

    if (props.className) {
        classNames.push(props.className);
    }

    if (props.isCollapsable) {
        let collapseBtnKey: string,
            handleCollapseBtnClick = () => {
                let collapsedState: boolean = !isCollapsed,
                    dimensionToUse: number;

                setCollapsed(collapsedState);

                if (dimension <= 0) {
                    if (props.configKey && localStorage.hasOwnProperty(props.configKey)) {
                        dimensionToUse = Number(localStorage.getItem(props.configKey));
                    } else {
                        dimensionToUse = props.initialDimension || Number(dimension);
                    }

                    if (dimensionToUse) {
                        setDimension(dimensionToUse);
                    }
                }

                localStorage.setItem(props.configKey + STORAGE_COLLAPSED_SUFFIX, collapsedState.toString());

                if (props.onCollapseToggle) {
                    props.onCollapseToggle(collapsedState);
                }
            };

        if (props.direction === SLIDER_DIRECTION.vertical) {
            if (isCollapsed) {
                collapseToggleIcon = faCaretDown;
            } else {
                collapseToggleIcon = faCaretUp;
            }
        } else {
            if (isCollapsed) {
                collapseToggleIcon = faCaretRight;
            } else {
                collapseToggleIcon = faCaretLeft;
            }
        }

        collapseBtnKey = isCollapsed ? "collapse-closed" : "collapse-open";

        collapseToggleBtn = <button
            key={collapseBtnKey}
            className="sliding-panel-collapse-btn"
            disabled={props.disabled}
            onClick={handleCollapseBtnClick}>
            <FontAwesomeIcon icon={collapseToggleIcon} />
        </button>
    }

    if (isCollapsed) {
        style.width = "0px";
        style.minWidth = "0px";
        classNames.push("sliding-panel-closed");
    } else {
        classNames.push("sliding-panel-opened");
    }

    return (
        <div className={classNames.join(" ")} ref={panelRef as any} style={style}>
            {collapseToggleBtn}
            {resizerWidget}
            {!isCollapsed && props.children}
        </div>
    );
}

//================================================================
function _windowMouseMoveFunc(direction: string, startValue: number, initialDimension: number, setDimension: Function, el: HTMLDivElement, e: MouseEvent) {
    let axisValue: number,
        newDimension: number;

    let computedStyle: CSSStyleDeclaration = window.getComputedStyle(el);

    if (direction === SLIDER_DIRECTION.vertical) {
        axisValue = e.clientY;
        newDimension = (initialDimension + startValue - axisValue);
        if (computedStyle.minHeight) {
            newDimension = Math.max(parseInt(computedStyle.minHeight) || 0, newDimension);
        }
    } else {
        axisValue = e.clientX;
        newDimension = (initialDimension - (startValue - axisValue));
        if (computedStyle.minWidth) {
            newDimension = Math.max(parseInt(computedStyle.minWidth) || 0, newDimension);
        }
    }

    setDimension(Math.round(newDimension));
}

//================================================================
function _windowMouseUpFunc() {
    window.removeEventListener("mousemove", onMouseMoveFunc as any);
    window.removeEventListener("mouseup", onMouseUpFunc as any);
}