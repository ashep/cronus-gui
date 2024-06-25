import * as React from "react";
import * as BTSvc from "../../service/Bluetooth";
import * as ConfigSvc from "../../service/Config";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import {Link, route} from "preact-router";

import Stack from "@mui/material/Stack";
import FormGroup from "@mui/material/FormGroup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Props {
    btConnStatus: BTSvc.ConnStatus
    cfgSvc: ConfigSvc.Service
}

interface State {
}

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
                    Click <Link href={"/device/"}>here</Link> to connect.
                </Box>
                :
                <Stack direction={"column"} spacing={1}>
                    <FormGroup>
                        {this.props.cfgSvc.DisplayType == ConfigSvc.DisplayType.MAX7219_32X16 &&
                            <FormControlLabel
                                label="Two-line mode"
                                control={
                                    <Checkbox checked={this.props.cfgSvc.MultilineMode}
                                              onChange={(_, v) => this.props.cfgSvc.SetMultilineMode(v)}
                                    />
                                }
                            />
                        }
                        <FormControlLabel
                            label="Show date"
                            control={
                                <Checkbox checked={this.props.cfgSvc.ShowDate}
                                          onChange={(_, v) => this.props.cfgSvc.SetShowDate(v)}
                                />
                            }
                        />
                        <FormControlLabel
                            label="Show ambient temperature"
                            control={
                                <Checkbox checked={this.props.cfgSvc.ShowAmbientTemp}
                                          onChange={(_, v) => this.props.cfgSvc.SetShowAmbientTemp(v)}
                                />
                            }
                        />
                        <FormControlLabel
                            label="Show weather temperature"
                            control={
                                <Checkbox checked={this.props.cfgSvc.ShowWeatherTemp}
                                          onChange={(_, v) => this.props.cfgSvc.SetShowWeatherTemp(v)}
                                />
                            }
                        />
                    </FormGroup>
                    <Button variant={"outlined"} startIcon={<ArrowBackIcon/>} onClick={() => route("/device")}>
                        Back
                    </Button>
                </Stack>
            }
        </Grid>;
    }
}