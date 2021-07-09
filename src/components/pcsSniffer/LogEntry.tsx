import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import LogSource from "./LogSource";
import ArgsPreview from "./ArgsPreview";

export interface ILog {
    src: string,
    func: string,
    args: Array<any>
    tstamp: number
}

interface ILogEntryProps {
    log: ILog
}

export enum LogType {
    PCSCallback = "PCSCallback",
    PCS = "PCS"
}

let argNamesCache = new Map(); // funcName => array of arg names

export default function LogEntry(props: ILogEntryProps) {
    let { src, func, args, tstamp } = props.log,
        argNames: Array<string> | void,
        argsPreview: string,
        funcToStr: string,
        logClass: string,
        logDate = new Date(),
        [isShowingArgs, setShowingArgs] = useState(false);

    argNames = argNamesCache.get(func);
    if (argNames === void (0)) {

        if (src === LogType.PCS) {
            // @ts-ignore
            funcToStr = window.g_oPCS_Bak[func].toString();
        } else {
            // @ts-ignore
            funcToStr = window.g_oPCSCallback_Bak[func].toString();
        }

        argNames = funcToStr
            .substr(0, Math.max(funcToStr.indexOf("\n"), funcToStr.indexOf("{")))
            .match(/\w+\((.*?)\)/)[1]
            .split(",")
            .map(arg => arg.trim())
            .filter(arg => arg !== "");

        argNamesCache.set(func, argNames);
    }

    // special render cases
    if (func === "synchronizeProducts") {
        argNames = [].concat(argNames);
        // @ts-ignore
        argNames[0] = args[0];
        // @ts-ignore
        argNames[2] = window.g_oPCS_Bak.SynchronizeProductType[args[2]];
    }

    if (func === "synchronizeDocument") {
        argNames = [].concat(argNames);
        // @ts-ignore
        argNames[0] = args[0];
    }

    if ((argNames === void (0) || (argNames as []).length === 0) && args.length > 0) {
        argNames = args.map((arg: any) => {
            let typeofArg: string = typeof (arg),
                argName: string;

            if (typeofArg === "string" && (arg as string).length < 100) {
                argName = arg;
            } else {
                argName = typeofArg;
            }

            return argName;
        });
    }

    argsPreview = (argNames as []).join(',');
    logDate.setTime(tstamp);

    return (
        <div className="log-entry-container">
            {isShowingArgs && <ArgsPreview args={args} onClose={() => setShowingArgs(false)} />}
            <div className={["log-entry-src", logClass].join(" ")}>
                <LogSource type={src as LogType} />
            </div>
            <button className="log-entry-show-args-btn" onClick={() => setShowingArgs(!isShowingArgs)}><FontAwesomeIcon icon={faInfoCircle} /></button>
            <div className="log-entry-func truncatable-text">{func}</div>
            <div className="log-entry-args truncatable-text">
                ({argsPreview})
            </div>
            <div className="log-entry-tstamp">{logDate.toLocaleTimeString()}</div>
        </div>
    );
}