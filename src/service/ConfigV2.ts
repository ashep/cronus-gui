import {signal, Signal} from "@preact/signals";
import {ConnStatus as btConnStatus, Service as btSvc} from "./Bluetooth";
import {ShowMode, FirmwareVersion, DisplayType} from "./Types";
import {debug} from "yaml/util";

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
    private bt: btSvc;
    private debug = false;

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

    constructor(btSvc: btSvc) {
        this.bt = btSvc;
    }

    public async Start() {
        await this.readCharacteristic(chrcUUID.firmwareVersion).then(v => {
            const newVerStr = new TextDecoder().decode(v);
            this.firmwareVersion.value = new FirmwareVersion().SetFromString(newVerStr);
        });
        await this.readCharacteristic(chrcUUID.display0Type).then(v => {
            this.displayType.value = v.getUint8(0) as DisplayType;
        })
        await this.readCharacteristic(chrcUUID.showMode).then(v => {
            this.showMode.value = v.getUint8(0) as ShowMode;
        })
        await this.readCharacteristic(chrcUUID.minBrightness).then(v => {
            this.minBrightness.value = v.getUint8(0);
        })
        await this.readCharacteristic(chrcUUID.maxBrightness).then(v => {
            this.maxBrightness.value = v.getUint8(0);
        })
        await this.readCharacteristic(chrcUUID.showTimeDuration).then(v => {
            this.showTimeDuration.value = v.getUint8(0);
        })
        await this.readCharacteristic(chrcUUID.showDateDuration).then(v => {
            this.showDateDuration.value = v.getUint8(0);
        })
        await this.readCharacteristic(chrcUUID.showOutdoorTempDuration).then(v => {
            this.showOutdoorTempDuration.value = v.getUint8(0);
        })
        await this.readCharacteristic(chrcUUID.allowUnstableFirmware).then(v => {
            this.allowUnstableFirmware.value = v.getUint8(0) != 0;
        })
    }

    get FirmwareVersion(): FirmwareVersion {
        return this.firmwareVersion.value;
    }

    get DisplayType(): DisplayType {
        return this.displayType.value;
    }

    get ShowMode(): ShowMode {
        return this.showMode.value;
    }

    get MinBrightness(): number {
        return this.minBrightness.value;
    }

    get MaxBrightness(): number {
        return this.maxBrightness.value;
    }

    get ShowTimeDuration(): number {
        return this.showTimeDuration.value;
    }

    get ShowDateDuration(): number {
        return this.showDateDuration.value;
    }

    get ShowOutdoorTempDuration(): number {
        return this.showOutdoorTempDuration.value;
    }

    get AllowUnstableFirmware(): boolean {
        return this.allowUnstableFirmware.value;
    }

    get ShowWeatherIconDuration(): number {
        return this.showWeatherIconDuration.value;
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
        if (this.bt.connStatus != btConnStatus.CONNECTED) {
            return;
        }

        let data = await this.bt.read(uuid);

        if (this.debug) {
            console.log("read", "0x" + uuid.toString(16), data);
        }

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

        if (this.debug) {
            console.log("write", "0x" + uuid.toString(16), data);
        }

        return this.bt.write(uuid, data);
    }
}
