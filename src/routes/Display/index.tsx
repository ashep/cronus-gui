import * as React from "react";
import * as BTSvc from "../../service/Bluetooth";
import * as ConfigSvc from "../../service/Config";
import {Link, route} from "preact-router";

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
import {ComponentChild} from "preact";

interface Props {
    btConnStatus: BTSvc.ConnStatus
    cfg: ConfigSvc.Service
}

interface State {
}

const durationValues = [
    {value: 0, label: "Don't show"},
    {value: 5, label: '5 sec'},
    {value: 15, label: '15 sec'},
    {value: 30, label: '30 sec'},
    {value: 45, label: '45 sec'},
    {value: 60, label: '1 min'},
];

const brightnessValues = [
    {value: 0, label: "1%"},
    {value: 3, label: "25%"},
    {value: 7, label: "50%"},
    {value: 11, label: "75%"},
    {value: 15, label: "100%"},
]

export default class Display extends React.Component<Props, State> {
    render(): React.JSX.Element {
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
                    You're not connected to your Cronus device.
                    Click <Link  href={"/device"}>here</Link> to connect.
                </Box>
                :
                <Stack direction={"column"} spacing={3}>
                    <FormControlLabel
                        label="Multiline mode"
                        control={
                            <Checkbox checked={this.props.cfg.MultilineMode}
                                      onChange={(_, v) =>
                                          this.props.cfg.SetMultilineMode(v)}
                            />
                        }
                    />

                    <FormControl variant="standard">
                        <InputLabel id="min-brightness-label">Minimum brightness</InputLabel>
                        <Select
                            labelId="min-brightness-duration"
                            id="min-brightness-duration-select"
                            value={this.props.cfg.DisplayMinBrightness}
                            label="minimum brightness level"
                            onChange={(e) =>
                                this.props.cfg.SetDisplayMinBrightness(Number((e.target as HTMLInputElement).value))}
                        >
                            {brightnessValues.map((opt) => {
                                    if (opt.value <= this.props.cfg.DisplayMaxBrightness) {
                                        return <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                    }
                                }
                            )}
                        </Select>
                    </FormControl>

                    <FormControl variant="standard">
                        <InputLabel id="max-brightness-label">Maximum brightness</InputLabel>
                        <Select
                            labelId="max-brightness-duration"
                            id="max-brightness-duration-select"
                            value={this.props.cfg.DisplayMaxBrightness}
                            label="Maximum brightness level"
                            onChange={(e) =>
                                this.props.cfg.SetDisplayMaxBrightness(Number((e.target as HTMLInputElement).value))}
                        >
                            {brightnessValues.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {!this.props.cfg.MultilineMode && (
                        <FormControl variant="standard">
                            <InputLabel id="show-time-duration-label">Show time</InputLabel>
                            <Select
                                labelId="show-time-duration"
                                id="show-time-duration-select"
                                value={this.props.cfg.ShowTimeDuration}
                                label="Show time"
                                onChange={(e) =>
                                    this.props.cfg.SetShowTimeDuration(Number((e.target as HTMLInputElement).value))}
                            >
                                {durationValues.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <FormControl variant="standard">
                        <InputLabel id="show-date-duration-label">Show date</InputLabel>
                        <Select
                            labelId="show-time-duration"
                            id="show-time-duration-select"
                            value={this.props.cfg.ShowDateDuration}
                            label="Show time"
                            onChange={(e) =>
                                this.props.cfg.SetShowDateDuration(Number((e.target as HTMLInputElement).value))}
                        >
                            {durationValues.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl variant="standard">
                        <InputLabel id="show-odr-temp-duration-label">Show outdoor temp</InputLabel>
                        <Select
                            labelId="show-odr-temp-duration"
                            id="show-odr-duration-select"
                            value={this.props.cfg.ShowOdrTempDuration}
                            label="Show outdoor temperature"
                            onChange={(e) =>
                                this.props.cfg.SetShowOdrTempDuration(Number((e.target as HTMLInputElement).value))}
                        >
                            {durationValues.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {(!this.props.cfg.MultilineMode && this.props.cfg.FirmwareVersion.GreaterThanOrEqualToString("0.0.1")) && (
                        <FormControl variant="standard">
                            <InputLabel id="show-weather-icon-duration-label">Show weather icon</InputLabel>
                            <Select
                                labelId="show-weather-icon-duration"
                                id="show-weather-icon-select"
                                value={this.props.cfg.ShowWeatherIconDuration}
                                label="Show weather icon"
                                onChange={(e) =>
                                    this.props.cfg.SetShowWeatherIconDuration(Number((e.target as HTMLInputElement).value))}
                            >
                                {durationValues.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <Button variant={"outlined"} startIcon={<ArrowBackIcon/>} onClick={() => route("/device")}>
                        Back
                    </Button>
                </Stack>
            }
        </Grid>;
    }
}