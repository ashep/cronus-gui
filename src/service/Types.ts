export enum DisplayType {
    NONE = 0,
    MAX7219_32X16 = 1,
    WS2812_32X16 = 2,
}

export enum DisplayShowMode {
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