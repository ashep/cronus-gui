import * as ConfigSvcV1 from "./ConfigV1";
import * as ConfigSvcV2 from "./ConfigV2";
import {FirmwareVersion, DisplayType, ShowMode} from "./Types";
import {Signal} from "@preact/signals";

export class Service {
    private v1: ConfigSvcV1.Service;
    private v2: ConfigSvcV2.Service;
    private useV2: boolean;

    constructor(v1: ConfigSvcV1.Service, v2: ConfigSvcV2.Service) {
        this.v1 = v1;
        this.v2 = v2;
        this.useV2 = false;
    }

    get FirmwareVersion(): FirmwareVersion {
        let v: FirmwareVersion;

        if (!this.useV2) {
            v = this.v1.FirmwareVersion;
            if (v.GreaterThanString("0.0.1")) {
                console.log("config: switched to v2");
                this.useV2 = true;
                this.v1.Stop();
            }
        } else {
            v = this.v2.FirmwareVersion;
        }

        return v;
    }

    get FirmwareVersionString(): string {
        let v = this.FirmwareVersion;
        let s = `${v.Major}.${v.Minor}.${v.Patch}`;
        if (v.Alpha != 0) {
            s += `-alpha${v.Alpha}`;
        }
        return s;
    }

    get DisplayType(): DisplayType {
        if (!this.useV2) {
            return this.v1.DisplayType;
        }
        return this.v2.DisplayType;
    }

    get ShowMode(): ShowMode {
        if (!this.useV2) {
            return this.v1.ShowMode;
        }
        return this.v2.ShowMode;
    }

    get MinBrightness(): number {
        if (!this.useV2) {
            return this.v1.MinBrightness;
        }
        return this.v2.MinBrightness;
    }

    get MaxBrightness(): number {
        if (!this.useV2) {
            return this.v1.MaxBrightness;
        }
        return this.v2.MaxBrightness;
    }

    get ShowTimeDuration(): number {
        if (!this.useV2) {
            return this.v1.ShowTimeDuration;
        }
        return this.v2.ShowTimeDuration;
    }

    get ShowDateDuration(): number {
        if (!this.useV2) {
            return this.v1.ShowDateDuration;
        }
        return this.v2.ShowDateDuration;
    }

    get ShowOutdoorTempDuration(): number {
        if (!this.useV2) {
            return this.v1.ShowOdrTempDuration;
        }
        return this.v2.ShowOutdoorTempDuration;
    }

    get ShowWeatherIconDuration(): number {
        if (!this.useV2) {
            return this.v1.ShowWeatherIconDuration;
        }
        return this.v2.ShowWeatherIconDuration;
    }

    get AllowUnstableFirmware(): boolean {
        if (!this.useV2) {
            return this.v1.AllowUnstableFirmware;
        }
        return this.v2.AllowUnstableFirmware;
    }

    async SetMinBrightness(v: number) {
        if (!this.useV2) {
            return this.v1.SetDisplayMinBrightness(v);
        }
        return this.v2.SetMinBrightness(v);
    }

    async SetMaxBrightness(v: number) {
        if (!this.useV2) {
            return this.v1.SetDisplayMaxBrightness(v);
        }
        return this.v2.SetMaxBrightness(v);
    }

    async SetShowMode(v: ShowMode): Promise<void> {
        if (!this.useV2) {
            return this.v1.SetShowMode(v);
        }
        return this.v2.SetShowMode(v);
    }

    async SetShowTimeDuration(v: number): Promise<void> {
        if (!this.useV2) {
            return this.v1.SetShowTimeDuration(v);
        }
        return this.v2.SetShowTimeDuration(v);
    }

    async SetShowDateDuration(v: number): Promise<void> {
        if (!this.useV2) {
            return this.v1.SetShowDateDuration(v);
        }
        return this.v2.SetShowDateDuration(v);
    }

    async SetShowOdrTempDuration(v: number): Promise<void> {
        if (!this.useV2) {
            return this.v1.SetShowOdrTempDuration(v);
        }
        return this.v2.SetShowOutdoorTempDuration(v);
    }

    async SetShowWeatherIconDuration(v: number): Promise<void> {
        if (!this.useV2) {
            return this.v1.SetShowWeatherIconDuration(v);
        }
        return this.v2.SetShowWeatherIconDuration(v);
    }

    async SetAllowUnstableFirmware(v: boolean): Promise<void> {
        if (!this.useV2) {
            return this.v1.SetAllowUnstableFirmware(v);
        }
        return this.v2.SetAllowUnstableFirmware(v);
    }
}