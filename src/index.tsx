import Header from "components/header/Header";
import Footer from "./components/footer/Footer";
import DataSourceControl from "./components/footer/DataSourceControl";
import SettingsPanel from "./components/footer/SettingsPanel";
import Loader from "components/loader/Loader";
import Overlay from "components/overlay/Overlay";
import SlidingPanel, { SLIDER_DIRECTION } from "components/slidingPanel/SlidingPanel";
import PCSSniffer from "components/pcsSniffer/PCSSniffer";
import Logger from "Logger";
import Utils from "Utils";

const CICAPI_FILENAME: string = "cicapi.web.js";

//=============================================================================
async function importCiCAPI(url: string) {
    let apiCodeUrl: string = url,
        response: Response,
        code: string;

    if (window.location.toString().includes("debug") && !apiCodeUrl.endsWith("/debug/" + CICAPI_FILENAME)) {
        apiCodeUrl = apiCodeUrl.replace(CICAPI_FILENAME, "debug/" + CICAPI_FILENAME);
    }

    response = await fetch(apiCodeUrl),
        code = await response.text();
    (new Function(code))();
}


export {
    importCiCAPI,
    Header as TestAppHeader,
    Footer as TestAppFooter,
    DataSourceControl,
    SettingsPanel,
    Loader,
    Overlay,
    SlidingPanel,
    SLIDER_DIRECTION,
    PCSSniffer,
    Logger,
    Utils
};