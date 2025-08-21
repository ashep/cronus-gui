import * as ConfigSvcV1 from "./ConfigV1";
import * as ConfigSvcV2 from "./ConfigV2";
import {FirmwareVersion, DisplayType, ShowMode} from "./Types";
import {ConnStatus as btConnStatus, Service as btSvc} from "./Bluetooth";
import {signal, Signal} from "@preact/signals";

export class Service {
    private btSvc: btSvc;
    private v1: ConfigSvcV1.Service;
    private v2: ConfigSvcV2.Service;
    private useV2: boolean;
    private v2DetectorInterval: number;
    private firmwareVersionString: Signal<string> = signal("0.0.0");

    constructor(btSvc: btSvc, v1: ConfigSvcV1.Service, v2: ConfigSvcV2.Service) {
        this.btSvc = btSvc;
        this.v1 = v1;
        this.v2 = v2;
        this.useV2 = false;

        this.runV2detector();
    }

    private runV2detector() {
        this.v2DetectorInterval = setInterval(async () => {
            // V1 client must do at least one fetch to give us understanding what firmware version it is dealing with.
            if (this.btSvc.connStatus != btConnStatus.CONNECTED || this.v1.FetchCount == 0) {
                return;
            }

            let v = this.v1.FirmwareVersion;
            if (v.String == "0.0.0" || v.GreaterThanString("0.0.1")) {
                console.log("config: switched to v2");
                this.useV2 = true;

                this.v1.Stop();
                clearInterval(this.v2DetectorInterval);

                await this.v2.Start();
                this.FirmwareVersion; // force firmware version refresh
            }
        }, 500)
    }

    get FirmwareVersion(): FirmwareVersion {
        let v = this.useV2 ? this.v2.FirmwareVersion : this.v1.FirmwareVersion;

        let s = `${v.Major}.${v.Minor}.${v.Patch}`;
        if (v.Alpha != 0) {
            s += `-alpha${v.Alpha}`;
        }
        this.firmwareVersionString.value = s;

        return v
    }

    get FirmwareVersionString(): string {
        return this.firmwareVersionString.value;
    }

    get DisplayType(): DisplayType {
        return this.useV2 ? this.v2.DisplayType : this.v1.DisplayType;
    }

    get ShowMode(): ShowMode {
        return this.useV2 ? this.v2.ShowMode : this.v1.ShowMode;
    }

    get MinBrightness(): number {
        return this.useV2 ? this.v2.MinBrightness : this.v1.MinBrightness;
    }

    get MaxBrightness(): number {
        return this.useV2 ? this.v2.MaxBrightness : this.v1.MaxBrightness;
    }

    get ShowTimeDuration(): number {
        return this.useV2 ? this.v2.ShowTimeDuration : this.v1.ShowTimeDuration;
    }

    get ShowDateDuration(): number {
        return this.useV2 ? this.v2.ShowDateDuration : this.v1.ShowDateDuration;
    }

    get LocationName(): string {
        return this.v2.LocationName;
    }

    get LocationLat(): number {
        return this.v2.LocationLat;
    }

    get LocationLng(): number {
        return this.v2.LocationLng;
    }

    get ShowOutdoorTempDuration(): number {
        if (!this.useV2) {
            return this.v1.ShowOdrTempDuration;
        }
        return this.v2.ShowOutdoorTempDuration;
    }

    get ShowWeatherIconDuration(): number {
        return this.useV2 ? this.v2.ShowWeatherIconDuration : this.v1.ShowWeatherIconDuration;
    }

    get AllowUnstableFirmware(): boolean {
        return this.useV2 ? this.v2.AllowUnstableFirmware : this.v1.AllowUnstableFirmware;
    }

    async SetMinBrightness(v: number) {
        return this.useV2 ? this.v2.SetMinBrightness(v) : this.v1.SetDisplayMinBrightness(v);
    }

    async SetMaxBrightness(v: number) {
        return this.useV2 ? this.v2.SetMaxBrightness(v) : this.v1.SetDisplayMaxBrightness(v);
    }

    async SetShowMode(v: ShowMode): Promise<void> {
        return this.useV2 ? this.v2.SetShowMode(v) : this.v1.SetShowMode(v);
    }

    async SetShowTimeDuration(v: number): Promise<void> {
        return this.useV2 ? this.v2.SetShowTimeDuration(v) : this.v1.SetShowTimeDuration(v);
    }

    async SetShowDateDuration(v: number): Promise<void> {
        return this.useV2 ? this.v2.SetShowDateDuration(v) : this.v1.SetShowDateDuration(v);
    }

    async SetShowOutdoorTempDuration(v: number): Promise<void> {
        return this.useV2 ? this.v2.SetShowOutdoorTempDuration(v) : this.v1.SetShowOutdoorTempDuration(v);
    }

    async SetShowWeatherIconDuration(v: number): Promise<void> {
        return this.useV2 ? this.v2.SetShowWeatherIconDuration(v) : this.v1.SetShowWeatherIconDuration(v);
    }

    async SetAllowUnstableFirmware(v: boolean): Promise<void> {
        return this.useV2 ? this.v2.SetAllowUnstableFirmware(v) : this.v1.SetAllowUnstableFirmware(v);
    }

    async SetLocationName(v: string): Promise<void> {
        if (!this.useV2) {
            throw new Error("Location is only supported in Config V2");
        }
        return this.v2.SetLocationName(v);
    }

    async SetLocationLat(v: number): Promise<void> {
        if (!this.useV2) {
            throw new Error("Location is only supported in Config V2");
        }
        return this.v2.SetLocationLat(v);
    }

    async SetLocationLng(v: number): Promise<void> {
        if (!this.useV2) {
            throw new Error("Location is only supported in Config V2");
        }
        return this.v2.SetLocationLng(v);
    }
}
