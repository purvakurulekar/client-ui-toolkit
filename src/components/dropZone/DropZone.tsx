import React from "react";
import "./dropZone.scss";

interface IDropZoneProps {
    onItemDrop(data: any): void,
    onLeave?(): void
}

export default function DropZone(props: IDropZoneProps) {
    function handleDrop(ev: React.DragEvent) {
        ev.preventDefault();
        try {
            let eventData: any = JSON.parse(ev.dataTransfer.getData("text/plain"));
            props.onItemDrop(eventData.data);
        } catch (e) {

        }
    }

    function handleDragOver(ev: React.DragEvent) {
        ev.preventDefault();
    }

    function handleLeave(ev: React.DragEvent) {
        ev.preventDefault();
        if (props.onLeave) {
            props.onLeave();
        }
    }

    return (
        <div className="drop-zone"
            onDrop={handleDrop}
            onDragLeave={handleLeave}
            onDragOver={handleDragOver}
        ></div>
    );
}
