import * as React from "react";
import {Link, route} from "preact-router";
import {useTranslation} from "react-i18next";
import * as BTSvc from "../../service/Bluetooth";
import * as ConfigSvc from "../../service/Config";
import {DisplayType, ShowMode} from "../../service/Types";

import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from '@mui/material/MenuItem';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Props {
    btConnStatus: BTSvc.ConnStatus
    cfg: ConfigSvc.Service
}

interface State {
}

const durationValues = [
    {value: 0, label: "Don't show"},
    {value: 1, label: '1 sec'},
    {value: 2, label: '2 sec'},
    {value: 3, label: '3 sec'},
    {value: 5, label: '5 sec'},
    {value: 15, label: '15 sec'},
    {value: 30, label: '30 sec'},
    {value: 45, label: '45 sec'},
    {value: 60, label: '1 min'},
];

const brightnessValues = [
    {value: 0, label: "1%"},
    {value: 3, label: "25%"},
    {value: 5, label: "37%"},
    {value: 7, label: "50%"},
    {value: 9, label: "63%"},
    {value: 11, label: "75%"},
    {value: 13, label: "87%"},
    {value: 15, label: "100%"},
]

const colorValues = [
    {value: 0, label: "colorBlack"},
    {value: 1, label: "colorRed"},
    {value: 2, label: "colorGreen"},
    {value: 3, label: "colorBlue"},
    {value: 4, label: "colorCyan"},
    {value: 5, label: "colorMagenta"},
    {value: 6, label: "colorYellow"},
    {value: 7, label: "colorWhite"},
    {value: 8, label: "colorOrange"},
    {value: 9, label: "colorPurple"},
    {value: 10, label: "colorPink"},
    {value: 11, label: "colorLime"},
    {value: 12, label: "colorTeal"},
    {value: 13, label: "colorBrown"},
    {value: 14, label: "colorGold"},
    {value: 15, label: "colorSilver"},
]

export default class Display extends React.Component<Props, State> {
    render(): React.JSX.Element {
        const {t} = useTranslation();

        return <Grid container
                     spacing={0}
                     direction="column"
                     alignItems="center"
                     justifyContent="center"
                     sx={{minHeight: '100vh'}}
        >
            <CssBaseline/>

            {this.props.btConnStatus != BTSvc.ConnStatus.CONNECTED
                ?
                <Box>
                    {t("noBluetoothConnection")}.&nbsp;
                    {t("clickTo")} <Link href={"/device"}>{t("connect").toLowerCase()}</Link>.
                </Box>
                :
                <Stack direction={"column"} spacing={3} minWidth={200} >
                    <FormControlLabel
                        label={t("multiLineMode")}
                        control={
                            <Checkbox checked={this.props.cfg.ShowMode == ShowMode.MultiLine}
                                      onChange={(_, v) => {
                                          this.props.cfg.SetShowMode(v ? ShowMode.MultiLine : ShowMode.SingleLine)
                                      }}
                            />
                        }
                    />

                    <FormControl variant="standard">
                        <InputLabel id="min-brightness-label">{t("minBrightness")}</InputLabel>
                        <Select
                            labelId="min-brightness"
                            id="min-brightness-duration"
                            value={this.props.cfg.MinBrightness}
                            label={t("minBrightness")}
                            onChange={(e) => this.props.cfg.SetMinBrightness(Number((e.target as HTMLInputElement).value))}
                        >
                            {brightnessValues.map((opt) => {
                                    if (opt.value <= this.props.cfg.MaxBrightness) {
                                        return <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                    }
                                }
                            )}
                        </Select>
                    </FormControl>

                    <FormControl variant="standard">
                        <InputLabel id="max-brightness-label">{t("maxBrightness")}</InputLabel>
                        <Select
                            labelId="max-brightness"
                            id="max-brightness-select"
                            value={this.props.cfg.MaxBrightness}
                            label={t("maxBrightness")}
                            onChange={(e) => this.props.cfg.SetMaxBrightness(Number((e.target as HTMLInputElement).value))}
                        >
                            {brightnessValues.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {this.props.cfg.ShowMode == ShowMode.SingleLine && (
                        <FormControl variant="standard">
                            <InputLabel id="show-time-duration-label">{t("showTime")}</InputLabel>
                            <Select
                                labelId="show-time-duration"
                                id="show-time-duration-select"
                                value={this.props.cfg.WidgetTimeDuration}
                                label={t("showTime")}
                                onChange={(e) => this.props.cfg.SetShowTimeDuration(Number((e.target as HTMLInputElement).value))}
                            >
                                {durationValues.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    {this.props.cfg.DisplayType == DisplayType.WS2812_32X16 && (
                        <FormControl variant="standard">
                            <InputLabel id="widget-time-color">{t("timeColor")}</InputLabel>
                            <Select
                                labelId="widget-time-color"
                                id="widget-time-color-select"
                                value={this.props.cfg.WidgetTimeColor}
                                label={t("timeColor")}
                                onChange={(e) => this.props.cfg.SetWidgetTimeColor(Number((e.target as HTMLInputElement).value))}
                            >
                                {colorValues.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{t(opt.label)}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <FormControl variant="standard">
                        <InputLabel id="show-date-duration-label">{t("showDate")}</InputLabel>
                        <Select
                            labelId="show-date-duration"
                            id="show-date-duration-select"
                            value={this.props.cfg.WidgetDateDuration}
                            label={t("showDate")}
                            onChange={(e) => this.props.cfg.SetWidgetDateDuration(Number((e.target as HTMLInputElement).value))}
                        >
                            {durationValues.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {this.props.cfg.DisplayType == DisplayType.WS2812_32X16 && (
                        <FormControl variant="standard">
                            <InputLabel id="widget-date-color">{t("dateColor")}</InputLabel>
                            <Select
                                labelId="widget-date-color"
                                id="widget-date-color-select"
                                value={this.props.cfg.WidgetDateColor}
                                label={t("dateColor")}
                                onChange={(e) => this.props.cfg.SetWidgetDateColor(Number((e.target as HTMLInputElement).value))}
                            >
                                {colorValues.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{t(opt.label)}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <FormControl variant="standard">
                        <InputLabel id="show-odr-temp-duration-label">{t("showOutdoorTemp")}</InputLabel>
                        <Select
                            labelId="show-odr-temp-duration"
                            id="show-odr-duration-select"
                            value={this.props.cfg.WidgetOutdoorTempDuration}
                            label={t("showOutdoorTemp")}
                            onChange={(e) => this.props.cfg.SetShowOutdoorTempDuration(Number((e.target as HTMLInputElement).value))}
                        >
                            {durationValues.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {this.props.cfg.DisplayType == DisplayType.WS2812_32X16 && (
                        <FormControl variant="standard">
                            <InputLabel id="widget-outdoor-temp-color">{t("outdoorTempColor")}</InputLabel>
                            <Select
                                labelId="widget-outdoor-temp-color"
                                id="widget-outdoor-temp-color-select"
                                value={this.props.cfg.WidgetOutdoorTempColor}
                                label={t("outdoorTempColor")}
                                onChange={(e) => this.props.cfg.SetWidgetOutdoorTempColor(Number((e.target as HTMLInputElement).value))}
                            >
                                {colorValues.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{t(opt.label)}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                    
                    {(this.props.cfg.ShowMode == ShowMode.SingleLine && this.props.cfg.FirmwareVersion.GreaterThanString("0.0.1")) && (
                        <FormControl variant="standard">
                            <InputLabel id="show-weather-icon-duration-label">{t("showWeatherIcon")}</InputLabel>
                            <Select
                                labelId="show-weather-icon-duration"
                                id="show-weather-icon-select"
                                value={this.props.cfg.WidgetWeatherIconDuration}
                                label={t("showWeatherIcon")}
                                onChange={(e) => this.props.cfg.SetShowWeatherIconDuration(Number((e.target as HTMLInputElement).value))}
                            >
                                {durationValues.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <Button variant={"outlined"} startIcon={<ArrowBackIcon/>} onClick={() => route("/device")}>
                        {t("back")}
                    </Button>
                </Stack>
            }
        </Grid>;
    }
}
