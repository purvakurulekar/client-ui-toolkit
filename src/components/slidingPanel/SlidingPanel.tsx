import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripLines, faGripLinesVertical } from "@fortawesome/free-solid-svg-icons";
import "./slidingPanel.scss";

export enum SLIDER_DIRECTION {
    vertical = "vertical",
    horizontal = "horizontal"
}

export interface ISlidingPanelProps {
    className?: string,
    direction?: SLIDER_DIRECTION, // up or down
    initialDimension?: number,
    configKey?: string,
    children: any
}

let onMouseMoveFunc: Function | null = null,
    onMouseUpFunc: Function | null = null;

export default function SlidingPanel(props: ISlidingPanelProps) {
    let [dimension, setDimension] = useState(props.initialDimension || "auto"),
        // [isSliding, setSliding] = useState(false),
        panelRef = useRef(),
        classNames = ["sliding-panel"],
        icon,
        style = {
        },
        draggerProps = {
            onMouseDown: (e: React.MouseEvent) => {
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
            }
        };

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

    if (props.className) {
        classNames.push(props.className);
    }

    if (props.direction === SLIDER_DIRECTION.vertical) {
        Object.assign(style, { height: dimension + "px" });
        icon = faGripLines;
        classNames.push("vertical-slider");
    } else {
        Object.assign(style, { width: dimension + "px" });
        icon = faGripLinesVertical;
        classNames.push("horizontal-slider");
    }

    return (
        <div className={classNames.join(" ")} ref={panelRef as any} style={style}>
            <div className="sliding-panel-btn-container" {...draggerProps} >
                <FontAwesomeIcon icon={icon} />
            </div>
            {props.children}
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
            newDimension = Math.max(parseInt(computedStyle.minHeight), newDimension);
        }
    } else {
        axisValue = e.clientX;
        newDimension = (initialDimension - (startValue - axisValue));
        if (computedStyle.minWidth) {
            newDimension = Math.max(parseInt(computedStyle.minWidth), newDimension);
        }
    }

    setDimension(Math.round(newDimension));
}

//================================================================
function _windowMouseUpFunc() {
    window.removeEventListener("mousemove", onMouseMoveFunc as any);
    window.removeEventListener("mouseup", onMouseUpFunc as any);
}