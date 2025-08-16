export enum DisplayType {
    NONE = 0,
    MAX7219_32X16 = 1,
    WS2812_32X16 = 2,
}

export enum ShowMode {
    SingleLine = 0,
    MultiLine = 1,
}

export class FirmwareVersion {
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

    public get String(): string {
        return `${this.Major}.${this.Minor}.${this.Patch}${this.Alpha !== 0 ? `-alpha${this.Alpha}` : ''}`;
    }

    SetFromString(str: string): FirmwareVersion {
        const parts = str.split('.');

        if (parts.length < 3) {
            throw new Error("Invalid version string format. Expected format: 'major.minor.patch[.alpha]'");
        }

        this.Major = parseInt(parts[0]);
        this.Minor = parseInt(parts[1]);
        this.Patch = parseInt(parts[2]);
        this.Alpha = parts.length > 3 ? parseInt(parts[3]) : 0;

        return this;
    }

    Equals(other: FirmwareVersion): boolean {
        return this.Major === other.Major &&
               this.Minor === other.Minor &&
               this.Patch === other.Patch &&
               this.Alpha === other.Alpha;
    }

    GreaterThan(other: FirmwareVersion): boolean {
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

        // alpha == 0 is considered stable, and stable versions are greater than alpha versions
        if (this.Alpha !== 0 && this.Alpha != 0) {
            return this.Alpha > other.Alpha;
        } else if(this.Alpha == 0 && other.Alpha != 0) {
            return true;
        }

        return false;
    }

    GreaterThanString(other: string): boolean {
        const parts = other.split('.');

        if (parts.length < 3) {
            throw new Error("Invalid version string format. Expected format: 'major.minor.patch[.alpha]'");
        }

        const major = parseInt(parts[0]);
        const minor = parseInt(parts[1]);
        const patch = parseInt(parts[2]);
        const alpha = parts.length > 3 ? parseInt(parts[3]) : 0;

        return this.GreaterThan(new FirmwareVersion(major, minor, patch, alpha));
    }
}