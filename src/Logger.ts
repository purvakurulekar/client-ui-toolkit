interface ILoggerStore {
    logs: Array<LogEntry>,
    onChangeCallbacks: Set<Function>
}

enum LOG_TYPE_ENUM {
    network = 0,
    trace = 1
}

let privateStore: WeakMap<Logger, ILoggerStore> = new WeakMap();

export interface IAvgTimings {
    min: number,
    avg: number,
    max: number
}

//=============================================================================
class Logger {
    //=========================================================================
    constructor() {
        privateStore.set(this, {
            logs: [] as Array<LogEntry>,
            onChangeCallbacks: new Set()
        });
    }

    //=========================================================================
    registerToChanges(callback: Function) {
        let loggerStore: ILoggerStore | undefined = privateStore.get(this);
        loggerStore?.onChangeCallbacks.add(callback);
    }

    //=========================================================================
    unregisterToChanges(callback: Function) {
        let loggerStore: ILoggerStore | undefined = privateStore.get(this);
        loggerStore?.onChangeCallbacks.delete(callback);
    }

    //=========================================================================
    getLogs(type?: LOG_TYPE_ENUM): Array<LogEntry> {
        let loggerStore: ILoggerStore | undefined = privateStore.get(this),
            logs: Array<LogEntry>;

        if (loggerStore) {
            logs = loggerStore.logs;
        } else {
            logs = [];
        }

        if (type !== void (0)) {
            logs = logs.filter(logEntry => logEntry.type === type);
        }

        return logs;
    }

    //=========================================================================
    getLastLog(type?: LOG_TYPE_ENUM): LogEntry | null {
        let loggerStore: ILoggerStore | undefined = privateStore.get(this),
            logs: Array<LogEntry> = loggerStore?.logs || [];

        if (type !== void (0)) {
            logs = logs.filter((logEntry: LogEntry) => logEntry.type === type);
        }
        return logs[logs.length - 1] || null;
    }

    //=========================================================================
    getAvgLogTimings(type?: LOG_TYPE_ENUM): IAvgTimings {
        let loggerStore: ILoggerStore | undefined = privateStore.get(this),
            logs: Array<LogEntry> = loggerStore?.logs || [],
            logTimings: Array<number>,
            minTiming: number = 0,
            maxTiming: number = 0,
            avgTiming: number = 0;

        if (type !== void (0)) {
            logs = logs.filter((logEntry: LogEntry) => logEntry.type === type);
        }

        if (logs.length > 0) {
            logTimings = logs.map((logEntry: LogEntry) => logEntry.time);

            minTiming = Math.min(...logTimings);
            maxTiming = Math.max(...logTimings);
            avgTiming = logTimings.reduce((acc: number, timing: number) => acc + timing, 0);
            avgTiming = Math.round(avgTiming / logs.length);
        }

        return {
            min: minTiming,
            max: maxTiming,
            avg: avgTiming
        };
    }


    //=========================================================================
    add(type: LOG_TYPE_ENUM, msg: string, time?: number, data?: string) {
        let loggerStore: ILoggerStore | undefined = privateStore.get(this);

        if (loggerStore) {
            loggerStore.logs.push(new LogEntry(type, msg, time, data));
            loggerStore.onChangeCallbacks.forEach((callback: Function) => callback());
        }
    }

    //=========================================================================
    reset() {
        let loggerStore: ILoggerStore | undefined = privateStore.get(this);

        if (loggerStore) {
            loggerStore.logs.length = 0;
            loggerStore.onChangeCallbacks.forEach((callback: Function) => callback());
        }
    }
}

export interface ILogEntry {
    msg: string;
    time: number;
    data: string;
    type: LOG_TYPE_ENUM;
}

//=============================================================================
class LogEntry implements ILogEntry {
    msg: string;
    time: number;
    data: string;
    type: LOG_TYPE_ENUM;

    //=========================================================================
    constructor(type: LOG_TYPE_ENUM, msg: string, time?: number, data?: string) {
        this.type = type;
        this.msg = msg;
        this.time = time || 0;
        this.data = data || "";
    }
}

export default new Logger();
export { LOG_TYPE_ENUM };