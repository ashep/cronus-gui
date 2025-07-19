import * as ConfigSvcV1 from "./ConfigV1";
import * as ConfigSvcV2 from "./ConfigV2";
import {FirmwareVersion, DisplayType} from "./Types";

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
        if (!this.useV2) {
            return this.v1.FirmwareVersion;
        }
        return this.v2.FirmwareVersion;
    }

    get FirmwareVersionString(): string {
        let fwVer: FirmwareVersion;

        if (!this.useV2) {
            fwVer = this.v1.FirmwareVersion;
        } else {
            fwVer = this.v2.FirmwareVersion;
        }

        let s = `${fwVer.Major}.${fwVer.Minor}.${fwVer.Patch}`;

        if (fwVer.Alpha != 0) {
            s += `-alpha${fwVer.Alpha}`;
        }

        return s;
    }

    get DisplayType(): DisplayType {
        if (!this.useV2) {
            return this.v1.DisplayType;
        }
        return this.v2.DisplayType;
    }

    get RTPPinSCL(): number {
        if (!this.useV2) {
            return this.v1.RTPPinSCL;
        }
        return this.v2.RTPPinSCL;
    }

    get RTPPinSDA(): number {
        if (!this.useV2) {
            return this.v1.RTPPinSDA;
        }
        return this.v2.RTPPinSDA;
    }

    get DisplayMinBrightness(): number {
        if (!this.useV2) {
            return this.v1.DisplayMinBrightness;
        }
        return this.v2.DisplayMinBrightness;
    }

    get DisplayMaxBrightness(): number {
        if (!this.useV2) {
            return this.v1.DisplayMaxBrightness;
        }
        return this.v2.DisplayMaxBrightness;
    }

    get MultilineMode(): boolean {
        if (!this.useV2) {
            return this.v1.MultilineMode;
        }
        return this.v2.MultilineMode;
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

    get ShowWeatherIconDuration(): number {
        if (!this.useV2) {
            return this.v1.ShowWeatherIconDuration;
        }
        return this.v2.ShowWeatherIconDuration;
    }

    get ShowOdrTempDuration(): number {
        if (!this.useV2) {
            return this.v1.ShowOdrTempDuration;
        }
        return this.v2.ShowOdrTempDuration;
    }

    get AllowUnstableFirmware(): boolean {
        if (!this.useV2) {
            return this.v1.AllowUnstableFirmware;
        }
        return this.v2.AllowUnstableFirmware;
    }

    async SetRTCPinSCL(v: number) {
        if (!this.useV2) {
            return this.v1.SetRTCPinSCL(v);
        }
        return this.v2.SetRTCPinSCL(v);
    }

    async SetRTCPinSDA(v: number) {
        if (!this.useV2) {
            return this.v1.SetRTCPinSDA(v);
        }
        return this.v2.SetRTCPinSDA(v);
    }

    async SetDisplayMinBrightness(v: number) {
        if (!this.useV2) {
            return this.v1.SetDisplayMinBrightness(v);
        }
        return this.v2.SetDisplayMinBrightness(v);
    }

    async SetDisplayMaxBrightness(v: number) {
        if (!this.useV2) {
            return this.v1.SetDisplayMaxBrightness(v);
        }
        return this.v2.SetDisplayMaxBrightness(v);
    }

    async SetMultilineMode(v: boolean): Promise<void> {
        if (!this.useV2) {
            return this.v1.SetMultilineMode(v);
        }
        return this.v2.SetMultilineMode(v);
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
        return this.v2.SetShowOdrTempDuration(v);
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