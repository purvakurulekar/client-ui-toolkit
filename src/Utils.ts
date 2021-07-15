// import ILCVector3 from "./interfaces/ILCVector3";
// import IQuaternion from "./interfaces/IQuaternion";

const
    SECONDS_MS = 1000,
    MINUTES_MS = SECONDS_MS * 60,
    HOURS_MS = MINUTES_MS * 60,
    MILLIS_TO_MINS_FACTOR = 60 / 1000,
    NUMBER_CODE_OFFSET = 48,
    UC_ALPHA_CODE_OFFSET = 65,
    LC_ALPHA_CODE_OFFSET = 97;

let g_nSeqId = 0;

class Utils {
    //=============================================================================
    static degToRad(deg: number): number {
        return deg / 180 * Math.PI;
    }

    //=============================================================================
    static radToDeg(rad: number): number {
        return rad / Math.PI * 180;
    }

    // pitch (x), roll (y), yaw (z)
    //=============================================================================
    static eulerToQuaternion(eulerAngleInDeg: ILCVector3): IQuaternion {
        let [halfXRot, halfYRot, halfZRot] = [this.degToRad(eulerAngleInDeg.x) / 2, this.degToRad(eulerAngleInDeg.y) / 2, this.degToRad(eulerAngleInDeg.z) / 2];
        let [
            cosPitch,
            sinPitch,
            cosRoll,
            sinRoll,
            cosYaw,
            sinYaw
        ] = [
                Math.cos(halfXRot),
                Math.sin(halfXRot),
                Math.cos(halfYRot),
                Math.sin(halfYRot),
                Math.cos(halfZRot),
                Math.sin(halfZRot)
            ];

        return {
            x: sinRoll * cosPitch * cosYaw - cosRoll * sinPitch * sinYaw,
            y: cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw,
            z: cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw,
            w: cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw
        };
    }

    //=============================================================================
    static genGUID() {
        // <8 hex>-<4 hex>-<4 hex>-<4 hex>-<12 hex>
        // 48 chars
        // ex: f885207c-4e32-4a06-80ae-3c2a7f800dd7
        let l_aGuid = new Array(32),
            l_nNumLen = 0,
            l_sNumStr;

        g_nSeqId++;

        l_sNumStr = g_nSeqId.toString();
        l_nNumLen = l_sNumStr.length;

        l_aGuid.fill(0);

        for (let i = l_nNumLen, j = 0; i > 0; i--, j++) {
            l_aGuid[l_aGuid.length - i] = l_sNumStr.charAt(j);
        }
        // l_aGuid = l_aGuid.map(() => Math.round(Math.random() * 15).toString(16));

        l_aGuid.splice(8, 0, "-");
        // index + 1
        l_aGuid.splice(13, 0, "-");
        // index + 2
        l_aGuid.splice(18, 0, "-");
        // index + 3
        l_aGuid.splice(23, 0, "-");

        return l_aGuid.join("");
    }

    //=============================================================================
    static genUUID(size: number = 8) {
        let i: number,
            code: number,
            chunks: Array<string> = [];

        for (i = 0; i < size; i++) {
            code = Math.round(Math.random() * 59);

            if (code < 10) { // 0 - 9
                code = NUMBER_CODE_OFFSET + code;
            } else if (code < 34) { // A - Z
                code -= 9;
                code = UC_ALPHA_CODE_OFFSET + code;
            } else { // a - z
                code -= (9 + 25);
                code = LC_ALPHA_CODE_OFFSET + code;
            }

            chunks.push(String.fromCharCode(code));
        }

        return chunks.join('');
    }

    //=============================================================================
    static cloneObj(object: Object) {
        return JSON.parse(JSON.stringify(object));
    }

    //=============================================================================
    static millisToString(timeInMillis: number): string {
        let nbSecs: number,
            nbMins: number,
            nbMs: number,
            timeStr: string = "over an hour :(";

        if (timeInMillis < SECONDS_MS) { // time stays in ms
            timeStr = timeInMillis + "ms";
        } else if (timeInMillis < MINUTES_MS) { // time stays in seconds
            nbSecs = Math.floor(timeInMillis / SECONDS_MS);
            timeStr = `${nbSecs}s${timeInMillis - (nbSecs * SECONDS_MS)}ms`;
        } else if (timeInMillis < HOURS_MS) { // time stays in minutes
            nbMins = Math.floor(timeInMillis / MILLIS_TO_MINS_FACTOR);
            nbSecs = Math.floor(timeInMillis - (nbMins * MINUTES_MS) / SECONDS_MS);
            nbMs = timeInMillis - (nbMins * MINUTES_MS) - (nbSecs * SECONDS_MS);

            timeStr = `${nbMins}m${nbSecs}s${nbMs}ms`;
        }

        return timeStr;
    }
}

export default Utils;