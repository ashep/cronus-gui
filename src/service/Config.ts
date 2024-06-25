import {signal, Signal} from "@preact/signals";
import {ConnStatus as btConnStatus, Service as btSvc} from "./Bluetooth";
import {bool} from "prop-types";

const chcUUID = 0xff02;

interface fwVer {
    Major: number;
    Minor: number;
    Patch: number;
}

export enum DisplayType {
    NONE = 0,
    MAX7219_32X8 = 1,
    MAX7219_32X16 = 2,
}

enum cfgID {
    versionMajor = 0,
    versionMinor = 1,
    versionPatch = 2,
    displayType = 3,
    settings1 = 4,
}

enum cfgBitsSettings1 {
    multilineMode = 0,
    showDate = 1,
    showAmbientTemp = 2,
    showWeatherTemp = 3,
}

export class Service {
    private btSvc: btSvc;
    private fwVer: Signal<fwVer> = signal({Major: 0, Minor: 0, Patch: 0});
    private displayType: Signal<DisplayType> = signal(DisplayType.NONE);

    private multilineMode: Signal<boolean> = signal(false);
    private showDate: Signal<boolean> = signal(false);
    private showAmbientTemp: Signal<boolean> = signal(false);
    private showWeatherTemp: Signal<boolean> = signal(false);

    private data: DataView = new DataView(new ArrayBuffer(16));

    constructor(btSvc: btSvc) {
        this.btSvc = btSvc;
        setInterval(this.fetch.bind(this), 1000);
    }

    get FirmwareVersionString(): string {
        return `${this.fwVer.value.Major}.${this.fwVer.value.Minor}.${this.fwVer.value.Patch}`;
    }

    get DisplayType(): DisplayType {
        return this.displayType.value;
    }

    get MultilineMode(): boolean {
        return this.multilineMode.value
    }

    get ShowDate(): boolean {
        return this.showDate.value;
    }

    get ShowAmbientTemp(): boolean {
        return this.showAmbientTemp.value;
    }

    get ShowWeatherTemp(): boolean {
        return this.showWeatherTemp.value;
    }

    private async fetch() {
        if (this.btSvc.connStatus != btConnStatus.CONNECTED) {
            return;
        }

        this.data = await this.btSvc.read(chcUUID);

        this.fwVer.value = {
            Major: this.data.getInt8(cfgID.versionMajor),
            Minor: this.data.getInt8(cfgID.versionMinor),
            Patch: this.data.getInt8(cfgID.versionPatch),
        };

        this.displayType.value = this.data.getInt8(cfgID.displayType);
        this.multilineMode.value = Boolean(this.data.getInt8(cfgID.settings1) & 1 << cfgBitsSettings1.multilineMode);
        this.showDate.value = Boolean(this.data.getInt8(cfgID.settings1) & 1 << cfgBitsSettings1.showDate);
        this.showAmbientTemp.value = Boolean(this.data.getInt8(cfgID.settings1) & 1 << cfgBitsSettings1.showAmbientTemp);
        this.showWeatherTemp.value = Boolean(this.data.getInt8(cfgID.settings1) & 1 << cfgBitsSettings1.showWeatherTemp);
    }

    async SetMultilineMode(v: boolean): Promise<void> {
        this.multilineMode.value = v;

        this.data.setInt8(
            cfgID.settings1,
            this.setBit(this.data.getInt8(cfgID.settings1), cfgBitsSettings1.multilineMode, v)
        );

        return this.btSvc.write(chcUUID, this.data);
    }

    async SetShowDate(v: boolean): Promise<void> {
        this.showDate.value = v;

        this.data.setInt8(
            cfgID.settings1,
            this.setBit(this.data.getInt8(cfgID.settings1), cfgBitsSettings1.showDate, v)
        );

        return this.btSvc.write(chcUUID, this.data);
    }

    async SetShowAmbientTemp(v: boolean): Promise<void> {
        this.showAmbientTemp.value = v;

        this.data.setInt8(
            cfgID.settings1,
            this.setBit(this.data.getInt8(cfgID.settings1), cfgBitsSettings1.showAmbientTemp, v)
        );

        return this.btSvc.write(chcUUID, this.data);
    }

    async SetShowWeatherTemp(v: boolean): Promise<void> {
        this.showWeatherTemp.value = v;

        this.data.setInt8(
            cfgID.settings1,
            this.setBit(this.data.getInt8(cfgID.settings1), cfgBitsSettings1.showWeatherTemp, v)
        );

        return this.btSvc.write(chcUUID, this.data);
    }

    private setBit(byte: number, pos: number, v: boolean): number {
        if (v) {
            byte |= 1 << pos;
        } else {
            byte &= ~(1 << pos);
        }

        return byte;
    }
}
