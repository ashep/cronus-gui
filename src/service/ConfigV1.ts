import {signal, Signal} from "@preact/signals";
import {ConnStatus as btConnStatus, Service as btSvc} from "./Bluetooth";
import {number} from "prop-types";

const chcUUID = 0xff02;

class FirmwareVersion {
    Major: number;
    Minor: number;
    Patch: number;
    Alpha: number;

    constructor(major: number = 0, minor: number = 0, patch: number = 0, alpha: number = 0) {
        this.Major = major;
        this.Minor = minor;
        this.Patch = patch;
        this.Alpha = alpha;
    }

    GreaterThanOrEqualTo(other: FirmwareVersion): boolean {
        if (this.Major > other.Major) {
            return true;
        } else if (this.Major < other.Major) {
            return false;
        }

        if (this.Minor > other.Minor) {
            return true;
        } else if (this.Minor < other.Minor) {
            return false;
        }

        if (this.Patch > other.Patch) {
            return true;
        } else if (this.Patch < other.Patch) {
            return false;
        }

        if (this.Alpha === 0) {
            return true;
        }

        return this.Alpha >= other.Alpha;
    }

    GreaterThanOrEqualToString(other: string): boolean {
        const parts = other.split('.');

        if (parts.length < 3) {
            throw new Error("Invalid version string format. Expected format: 'major.minor.patch[.alpha]'");
        }

        const major = parseInt(parts[0]);
        const minor = parseInt(parts[1]);
        const patch = parseInt(parts[2]);
        const alpha = parts.length > 3 ? parseInt(parts[3].replace('alpha', '')) : 0;

        return this.GreaterThanOrEqualTo(new FirmwareVersion(major, minor, patch, alpha));
    }
}

export enum DisplayType {
    NONE = 0,
    MAX7219_32X16 = 1,
    WS2812_32X16 = 2,
}

enum displayShowMode {
    SingleLine = 0,
    MultiLine = 1,
}

enum cfgID {
    appVerMajor = 0,
    appVerMinor = 1,
    appVerPatch = 2,
    appVerAlpha = 3,

    displayType = 30,

    rtcPinSCL = 70,
    rtcPinSDA = 71,

    displayShowMode = 128,
    displayMinBrightness = 129,
    displayMaxBrightness = 130,
    showTimeDuration = 131,
    showDateDuration = 132,
    showDOWDuration = 133,
    showAmbTempDuration = 134,
    showOdrTempDuration = 135,
    allowUnstableFirmware = 136,
    showWeatherIconDuration = 137,
}

export class Service {
    private btSvc: btSvc;

    private fwVer: Signal<FirmwareVersion> = signal(new FirmwareVersion(0, 0, 0, 0));

    private displayType: Signal<DisplayType> = signal(DisplayType.NONE);

    private rtcPinSCL: Signal<number> = signal(0);
    private rtcPinSDA: Signal<number> = signal(0);

    private multilineMode: Signal<boolean> = signal(false);
    private displayMinBrightness: Signal<number> = signal(0);
    private displayMaxBrightness: Signal<number> = signal(15);

    private showTimeDuration: Signal<number> = signal(30);
    private showDateDuration: Signal<number> = signal(5);
    private showDOWDuration: Signal<number> = signal(5);
    private showAmbTempDuration: Signal<number> = signal(5);
    private showOdrTempDuration: Signal<number> = signal(5);
    private showWeatherIconDuration: Signal<number> = signal(5);
    private allowUnstableFirmware: Signal<boolean> = signal(false);

    constructor(btSvc: btSvc) {
        this.btSvc = btSvc;
        setInterval(this.fetch.bind(this), 1000);
    }

    get FirmwareVersion(): FirmwareVersion {
        return this.fwVer.value;
    }

    get FirmwareVersionString(): string {
        let s = `${this.fwVer.value.Major}.${this.fwVer.value.Minor}.${this.fwVer.value.Patch}`;

        if (this.fwVer.value.Alpha != 0) {
            s += `-alpha${this.fwVer.value.Alpha}`;
        }

        return s;
    }

    get DisplayType(): DisplayType {
        return this.displayType.value;
    }

    get RTPPinSCL(): number {
        return this.rtcPinSCL.value;
    }

    get RTPPinSDA(): number {
        return this.rtcPinSDA.value;
    }

    get DisplayMinBrightness(): number {
        return this.displayMinBrightness.value;
    }

    get DisplayMaxBrightness(): number {
        return this.displayMaxBrightness.value;
    }

    get MultilineMode(): boolean {
        return this.multilineMode.value
    }

    get ShowTimeDuration(): number {
        return this.showTimeDuration.value;
    }

    get ShowDateDuration(): number {
        return this.showDateDuration.value;
    }

    get ShowWeatherIconDuration(): number {
        return this.showWeatherIconDuration.value;
    }

    get ShowOdrTempDuration(): number {
        return this.showOdrTempDuration.value;
    }

    get AllowUnstableFirmware(): boolean {
        return this.allowUnstableFirmware.value;
    }

    async SetRTCPinSCL(v: number) {
        this.rtcPinSCL.value = v;
        return this.setCfgVal(cfgID.rtcPinSCL, v)
    }

    async SetRTCPinSDA(v: number) {
        this.rtcPinSDA.value = v;
        return this.setCfgVal(cfgID.rtcPinSDA, v)
    }

    async SetDisplayMinBrightness(v: number) {
        this.displayMinBrightness.value = v;
        return this.setCfgVal(cfgID.displayMinBrightness, v)
    }

    async SetDisplayMaxBrightness(v: number) {
        this.displayMaxBrightness.value = v;
        return this.setCfgVal(cfgID.displayMaxBrightness, v)
    }

    async SetMultilineMode(v: boolean): Promise<void> {
        this.multilineMode.value = v;
        if (v) {
            return this.setCfgVal(cfgID.displayShowMode, displayShowMode.MultiLine)
        } else {
            return this.setCfgVal(cfgID.displayShowMode, displayShowMode.SingleLine)
        }
    }

    async SetShowTimeDuration(v: number): Promise<void> {
        this.showTimeDuration.value = v;
        return this.setCfgVal(cfgID.showTimeDuration, v)
    }

    async SetShowDateDuration(v: number): Promise<void> {
        this.showDateDuration.value = v;
        return this.setCfgVal(cfgID.showDateDuration, v)
    }

    async SetShowOdrTempDuration(v: number): Promise<void> {
        this.showOdrTempDuration.value = v;
        return this.setCfgVal(cfgID.showOdrTempDuration, v)
    }

    async SetShowWeatherIconDuration(v: number): Promise<void> {
        this.showWeatherIconDuration.value = v;
        return this.setCfgVal(cfgID.showWeatherIconDuration, v)
    }

    async SetAllowUnstableFirmware(v: boolean): Promise<void> {
        this.allowUnstableFirmware.value = v;
        return this.setCfgVal(cfgID.allowUnstableFirmware, Number(v))
    }

    private async setCfgVal(id: number, val: number) {
        const d = new Uint8Array(2);

        d[0] = id;
        d[1] = val;

        return this.btSvc.write(chcUUID, d);
    }

    private async fetch() {
        if (this.btSvc.connStatus != btConnStatus.CONNECTED) {
            return;
        }

        let data = await this.btSvc.read(chcUUID);

        this.fwVer.value = new FirmwareVersion(
            data.getInt8(cfgID.appVerMajor),
            data.getInt8(cfgID.appVerMinor),
            data.getInt8(cfgID.appVerPatch),
            data.getInt8(cfgID.appVerAlpha),
        );

        this.displayType.value = data.getInt8(cfgID.displayType);

        this.rtcPinSCL.value = data.getInt8(cfgID.rtcPinSCL);
        this.rtcPinSDA.value = data.getInt8(cfgID.rtcPinSDA);

        this.multilineMode.value = data.getInt8(cfgID.displayShowMode) == displayShowMode.MultiLine;

        this.displayMinBrightness.value = data.getInt8(cfgID.displayMinBrightness);
        this.displayMaxBrightness.value = data.getInt8(cfgID.displayMaxBrightness);

        this.showTimeDuration.value = data.getInt8(cfgID.showTimeDuration);
        this.showDateDuration.value = data.getInt8(cfgID.showDateDuration);
        this.showDOWDuration.value = data.getInt8(cfgID.showDOWDuration);
        this.showAmbTempDuration.value = data.getInt8(cfgID.showAmbTempDuration);
        this.showOdrTempDuration.value = data.getInt8(cfgID.showOdrTempDuration);
        this.allowUnstableFirmware.value = Boolean(data.getInt8(cfgID.allowUnstableFirmware));
    }
}
