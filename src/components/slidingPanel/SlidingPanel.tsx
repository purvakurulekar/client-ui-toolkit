import React, { useState, useRef, useEffect, CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines, faGripLinesVertical, faCaretLeft, faCaretRight, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import "./slidingPanel.scss";

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
    let [dimension, setDimension] = useState(props.initialDimension || "auto"),
        [isCollapsed, setCollapsed] = useState(Boolean(props.isCollapsed)),
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

            // setSliding(true);

            if (onMouseUpFunc !== null || onMouseMoveFunc !== null) {
                window.removeEventListener("mousemove", onMouseMoveFunc as any);
                window.removeEventListener("mouseup", onMouseUpFunc as any);
            }

            if (props.direction === SLIDER_DIRECTION.vertical) {
                startAxisValue = e.clientY;
            } else {
                startAxisValue = e.clientX;
            }

            if (dimension === "auto") {
                // @ts-ignore
                dimension = (panelRef.current as HTMLDivElement).getBoundingClientRect().height;
            }

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
        if (panelRef && panelRef.current) {
            let boundingRect = (panelRef?.current as unknown as HTMLDivElement)?.getBoundingClientRect();

            if (props.direction === SLIDER_DIRECTION.vertical && boundingRect.height < dimension) {
                dimension = Math.round(boundingRect.height);
                setDimension(dimension);
            } else if (boundingRect.width < dimension) {
                dimension = Math.round(boundingRect.width);
                setDimension(dimension);
            }
        }

        if (props.configKey) {
            CiCAPI.setConfig(props.configKey, dimension);
        }
    }, [dimension]);

    useEffect(() => {
        if (props.isCollapsed !== undefined) {
            setCollapsed(props.isCollapsed)
        }
    }, [props.isCollapsed]);

    if (props.className) {
        classNames.push(props.className);
    }

    if (props.isCollapsable) {
        let collapseBtnKey: string,
            handleCollapseBtnClick = () => {
                let collapsedState: boolean = !isCollapsed;
                setCollapsed(collapsedState);
                
                if (dimension <= 0 && props.initialDimension) {
                    setDimension(props.initialDimension);
                }

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