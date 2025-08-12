import {signal, Signal} from "@preact/signals";
import {ConnStatus as btConnStatus, Service as btSvc} from "./Bluetooth";
import {ShowMode, FirmwareVersion, DisplayType} from "./Types";

enum chrcUUID {
    firmwareVersion = 0xf000,
    display0Type = 0xf001,

    showMode = 0xf010,
    minBrightness = 0xf011,
    maxBrightness = 0xf012,
    showTimeDuration = 0xf013,
    showDateDuration = 0xf014,
    showDayOfWeekDuration = 0xf015, // not implemented
    showAmbientTempDuration = 0xf016, // not implemented
    showOutdoorTempDuration = 0xf017,
    allowUnstableFirmware = 0xf018,
    showWeatherIconDuration = 0xf019,
    locationName = 0xf01a,
}

export class Service {
    private btSvc: btSvc;

    private firmwareVersion: Signal<FirmwareVersion> = signal(new FirmwareVersion(0, 0, 0, 0));
    private displayType: Signal<DisplayType> = signal(DisplayType.NONE);
    private showMode: Signal<ShowMode> = signal(ShowMode.SingleLine);
    private minBrightness: Signal<number> = signal(0);
    private maxBrightness: Signal<number> = signal(0);
    private showTimeDuration: Signal<number> = signal(0);
    private showDateDuration: Signal<number> = signal(0);
    private showOutdoorTempDuration: Signal<number> = signal(0);
    private allowUnstableFirmware: Signal<boolean> = signal(false);
    private showWeatherIconDuration: Signal<number> = signal(0);

    // Contains characteristic UUIDs which values are not fetched from the device yet
    private readCache: Record<number, boolean> = {};

    constructor(btSvc: btSvc) {
        this.btSvc = btSvc;
    }

    get FirmwareVersion(): FirmwareVersion {
        this.readCharacteristic(chrcUUID.firmwareVersion).then(v => {
            const newVerStr = new TextDecoder().decode(v);
            const newVer = new FirmwareVersion().SetFromString(newVerStr);
            if (!this.firmwareVersion.value.Equals(newVer)) {
                this.firmwareVersion.value = newVer;
            }
        });
        return this.firmwareVersion.value;
    }

    get DisplayType(): DisplayType {
        this.readCharacteristic(chrcUUID.display0Type).then(v => {
            const newDisplayType = v.getUint8(0) as DisplayType;
            if (this.displayType.value != newDisplayType) {
                this.displayType.value = newDisplayType;
            }
        })

        return this.displayType.value;
    }

    get ShowMode(): ShowMode {
        if (this.readCache[chrcUUID.showMode]) {
            return this.showMode.value;
        }
        this.readCharacteristic(chrcUUID.showMode).then(v => {
            this.showMode.value = v.getUint8(0) as ShowMode;
        })
        return this.showMode.value;
    }

    get MinBrightness(): number {
        if (this.readCache[chrcUUID.minBrightness]) {
            return this.minBrightness.value;
        }
        this.readCharacteristic(chrcUUID.minBrightness).then(v => {
            this.minBrightness.value = v.getUint8(0);
        })
        return this.minBrightness.value;
    }

    get MaxBrightness(): number {
        if (this.readCache[chrcUUID.maxBrightness]) {
            return this.maxBrightness.value;
        }
        this.readCharacteristic(chrcUUID.maxBrightness).then(v => {
            this.maxBrightness.value = v.getUint8(0);
        })
        return this.maxBrightness.value;
    }

    get ShowTimeDuration(): number {
        if (this.readCache[chrcUUID.showTimeDuration]) {
            return this.showTimeDuration.value;
        }
        this.readCharacteristic(chrcUUID.showTimeDuration).then(v => {
            this.showTimeDuration.value = v.getUint8(0);
        })
        return this.showTimeDuration.value;
    }

    get ShowDateDuration(): number {
        if (this.readCache[chrcUUID.showDateDuration]) {
            return this.showDateDuration.value;
        }
        this.readCharacteristic(chrcUUID.showDateDuration).then(v => {
            this.showDateDuration.value = v.getUint8(0);
        })
        return this.showDateDuration.value;
    }

    get ShowOutdoorTempDuration(): number {
        if (this.readCache[chrcUUID.showOutdoorTempDuration]) {
            return this.showOutdoorTempDuration.value;
        }
        this.readCharacteristic(chrcUUID.showOutdoorTempDuration).then(v => {
            this.showOutdoorTempDuration.value = v.getUint8(0);
        })
        return this.showOutdoorTempDuration.value;
    }

    get AllowUnstableFirmware(): boolean {
        if (this.readCache[chrcUUID.allowUnstableFirmware]) {
            return this.allowUnstableFirmware.value;
        }
        this.readCharacteristic(chrcUUID.allowUnstableFirmware).then(v => {
            this.allowUnstableFirmware.value = v.getUint8(0) != 0;
        })
        return this.allowUnstableFirmware.value;
    }

    get ShowWeatherIconDuration(): number {
        if (this.readCache[chrcUUID.showWeatherIconDuration]) {
            return this.showWeatherIconDuration.value;
        }
        this.readCharacteristic(chrcUUID.showWeatherIconDuration).then(v => {
            this.showWeatherIconDuration.value = v.getUint8(0);
        })
        return this.showWeatherIconDuration.value;
    }

    async SetRTCPinSCL(v: number) {
        // TODO
    }

    async SetRTCPinSDA(v: number) {
        // TODO
    }

    async SetShowMode(v: ShowMode): Promise<void> {
        await this.writeCharacteristic(chrcUUID.showMode, v);
        this.showMode.value = v;
    }

    async SetMinBrightness(v: number) {
        await this.writeCharacteristic(chrcUUID.minBrightness, v);
        this.minBrightness.value = v;
    }

    async SetMaxBrightness(v: number) {
        await this.writeCharacteristic(chrcUUID.maxBrightness, v);
        this.maxBrightness.value = v;
    }

    async SetShowTimeDuration(v: number): Promise<void> {
        await this.writeCharacteristic(chrcUUID.showTimeDuration, v);
        this.showTimeDuration.value = v;
    }

    async SetShowDateDuration(v: number): Promise<void> {
        await this.writeCharacteristic(chrcUUID.showDateDuration, v);
        this.showDateDuration.value = v;
    }

    async SetShowOutdoorTempDuration(v: number): Promise<void> {
        await this.writeCharacteristic(chrcUUID.showOutdoorTempDuration, v);
        this.showOutdoorTempDuration.value = v;
    }

    async SetAllowUnstableFirmware(v: boolean): Promise<void> {
        await this.writeCharacteristic(chrcUUID.allowUnstableFirmware, v ? 1 : 0);
        this.allowUnstableFirmware.value = v;
    }

    async SetShowWeatherIconDuration(v: number): Promise<void> {
        await this.writeCharacteristic(chrcUUID.showWeatherIconDuration, v);
        this.showWeatherIconDuration.value = v;
    }

    private async readCharacteristic(uuid: chrcUUID) {
        if (this.btSvc.connStatus != btConnStatus.CONNECTED) {
            return;
        }

        let data = await this.btSvc.read(uuid);
        this.readCache[uuid] = true;

        console.log("read", uuid, data);

        return data;
    }

    private async writeCharacteristic(uuid: chrcUUID, val: string | number) {
        let data: BufferSource;

        if (typeof val === 'number') {
            data = new Uint8Array([val]);
        } else if (typeof val === 'string') {
            data = new TextEncoder().encode(val);
        } else {
            throw "unexpected type " + typeof val;
        }

        console.log("write", uuid, data);

        return this.btSvc.write(uuid, data);
    }
}
