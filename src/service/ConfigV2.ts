import {signal, Signal} from "@preact/signals";
import {ConnStatus as btConnStatus, Service as btSvc} from "./Bluetooth";
import {FirmwareVersion} from "./Types";

export enum DisplayType {
    NONE = 0,
    MAX7219_32X16 = 1,
    WS2812_32X16 = 2,
}

enum displayShowMode {
    SingleLine = 0,
    MultiLine = 1,
}

enum chrcUUID {
    firmwareVersion = 0xf000,
    display0Type = 0xf001,

    showMode = 0xf010,
    brightnessMin = 0xf011,
    brightnessMax = 0xf012,
    showDurationTime = 0xf013,
    showDurationDate = 0xf014,
    showDurationDayOfWeek = 0xf015,
    showDurationAmbientTemp = 0xf016,
    showDurationOutdoorTemp = 0xf017,
    allowUnstableFirmware = 0xf018,
    showDurationWeatherIcon = 0xf019,
    locationName = 0xf01a,
}

export class Service {
    private btSvc: btSvc;

    constructor(btSvc: btSvc) {
        this.btSvc = btSvc;
    }

    get FirmwareVersion(): FirmwareVersion {
        // TODO
        return new FirmwareVersion();
    }

    get FirmwareVersionString(): string {
        // TODO

        return "";
    }

    get DisplayType(): DisplayType {
        // TODO
        return DisplayType.NONE
    }

    get RTPPinSCL(): number {
        // TODO
        return 0;
    }

    get RTPPinSDA(): number {
        // TODO
        return 0;
    }

    get DisplayMinBrightness(): number {
        // TODO
        return 0;
    }

    get DisplayMaxBrightness(): number {
        // TODO
        return 0;
    }

    get MultilineMode(): boolean {
        // TODO
        return false;
    }

    get ShowTimeDuration(): number {
        // TODO
        return 0;
    }

    get ShowDateDuration(): number {
        // TODO
        return 0;
    }

    get ShowWeatherIconDuration(): number {
        // TODO
        return 0;
    }

    get ShowOdrTempDuration(): number {
        // TODO
        return 0;
    }

    get AllowUnstableFirmware(): boolean {
        // TODO
        return false;
    }

    async SetRTCPinSCL(v: number) {
        // TODO
    }

    async SetRTCPinSDA(v: number) {
        // TODO
    }

    async SetDisplayMinBrightness(v: number) {
        // TODO
    }

    async SetDisplayMaxBrightness(v: number) {
        // TODO
    }

    async SetMultilineMode(v: boolean): Promise<void> {
        // TODO
    }

    async SetShowTimeDuration(v: number): Promise<void> {
        // TODO
    }

    async SetShowDateDuration(v: number): Promise<void> {
        // TODO
    }

    async SetShowOdrTempDuration(v: number): Promise<void> {
        // TODO
    }

    async SetShowWeatherIconDuration(v: number): Promise<void> {
        // TODO
    }

    async SetAllowUnstableFirmware(v: boolean): Promise<void> {
        // TODO
    }

    private async readCharacteristic(uuid: chrcUUID) {
        if (this.btSvc.connStatus != btConnStatus.CONNECTED) {
            return;
        }

        let data = await this.btSvc.read(uuid);
    }

    private async writeCharacteristic(uuid: chrcUUID, val: string | number) {
        let data: BufferSource;

        if (typeof val === 'number') {
            data = new Uint8Array([val]);
        } else if (typeof val === 'string') {
            data = new TextEncoder().encode(val);
        }

        return this.btSvc.write(uuid, data);
    }
}
