import {signal, Signal} from "@preact/signals";
import {ConnStatus as btConnStatus, Service as btSvc} from "./Bluetooth";
import {ShowMode, DisplayType, FirmwareVersion} from "./Types";

const chcUUID = 0xff02;

enum cfgID {
    appVerMajor = 0,
    appVerMinor = 1,
    appVerPatch = 2,
    appVerAlpha = 3,

    displayType = 30,
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
    private fetchIntervalID: number;
    private fetchCount: number;
    private btSvc: btSvc;
    private fwVer: Signal<FirmwareVersion> = signal(new FirmwareVersion(0, 0, 0, 0));
    private displayType: Signal<DisplayType> = signal(DisplayType.NONE);
    private displayShowMode: Signal<ShowMode> = signal(ShowMode.SingleLine);
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
        this.fetchIntervalID = setInterval(this.fetch.bind(this), 1000);
        this.fetchCount = 0;
    }

    get IsStopped(): boolean {
        return this.fetchIntervalID === undefined || this.fetchIntervalID === 0;
    }

    get FetchCount(): number {
        return this.fetchCount;
    }

    get FirmwareVersion(): FirmwareVersion {
        return this.fwVer.value;
    }

    get DisplayType(): DisplayType {
        return this.displayType.value;
    }

    get ShowMode(): ShowMode {
        return this.displayShowMode.value;
    }

    get MinBrightness(): number {
        return this.displayMinBrightness.value;
    }

    get MaxBrightness(): number {
        return this.displayMaxBrightness.value;
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

    async SetDisplayMinBrightness(v: number) {
        this.displayMinBrightness.value = v;
        return this.setCfgVal(cfgID.displayMinBrightness, v)
    }

    async SetDisplayMaxBrightness(v: number) {
        this.displayMaxBrightness.value = v;
        return this.setCfgVal(cfgID.displayMaxBrightness, v)
    }

    async SetShowMode(v: ShowMode): Promise<void> {
        this.displayShowMode.value = v;
        return this.setCfgVal(cfgID.displayShowMode, v)
    }

    async SetShowTimeDuration(v: number): Promise<void> {
        this.showTimeDuration.value = v;
        return this.setCfgVal(cfgID.showTimeDuration, v)
    }

    async SetShowDateDuration(v: number): Promise<void> {
        this.showDateDuration.value = v;
        return this.setCfgVal(cfgID.showDateDuration, v)
    }

    async SetShowOutdoorTempDuration(v: number): Promise<void> {
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

    public Stop() {
        if (this.IsStopped) {
            return
        }
        clearInterval(this.fetchIntervalID);
        this.fetchIntervalID = undefined;
        console.log("V1 client has been stopped");
    }

    private async fetch() {
        if (this.btSvc.connStatus != btConnStatus.CONNECTED) {
            return;
        }

        let data: DataView;
        try {
            data = await this.btSvc.read(chcUUID);
        } catch (e) {
            this.fetchCount++;
            if (e.toString().toLowerCase().includes('no characteristics matching uuid 0000ff02')) {
                this.Stop();
            }
            throw e;
        }

        this.fetchCount++;

        this.fwVer.value = new FirmwareVersion(
            data.getInt8(cfgID.appVerMajor),
            data.getInt8(cfgID.appVerMinor),
            data.getInt8(cfgID.appVerPatch),
            data.getInt8(cfgID.appVerAlpha),
        );

        this.displayType.value = data.getInt8(cfgID.displayType);
        this.displayShowMode.value = data.getInt8(cfgID.displayShowMode) as ShowMode;
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
