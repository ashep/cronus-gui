import * as React from 'react';
import {route, Link} from 'preact-router';

import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import WiFiIcon from "@mui/icons-material/Wifi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import * as BTSvc from "../../service/Bluetooth";
import * as WiFiSvc from "../../service/WiFi";
import {useTranslation} from "react-i18next";

interface Props {
    btConnStatus: BTSvc.ConnStatus
    wifiSvc: WiFiSvc.Service
}

interface State {
    credentials: WiFiSvc.Credentials;
}

export default class WiFi extends React.Component<Props, State> {
    private _connTry: number = 0;

    constructor() {
        super();

        this.state = {
            credentials: {ssid: "", password: ""},
        };
    }

    renderSSIDChooser(): React.JSX.Element {
        const {t} = useTranslation();

        return (
            <Box sx={{flexDirection: "column", alignItems: "center"}}>
                <Box sx={{mb: 2}}>
                    {t("selectWiFiNetwork")}:
                </Box>

                {!this.props.wifiSvc.ssidList.length &&
                    <Box sx={{textAlign: "center", mb: 1}}>
                        <CircularProgress/>
                    </Box>
                }

                <Stack direction="column" spacing={1}>
                    {this.props.wifiSvc.ssidList.map(item =>
                        <Button variant={"contained"}
                                startIcon={<WiFiIcon/>}
                                onClick={() => this.setState({
                                    credentials: {
                                        ssid: item,
                                        password: this.state.credentials.password,
                                    }
                                })}
                        >
                            {item}
                        </Button>
                    )}
                    <Button variant={"outlined"} startIcon={<ArrowBackIcon/>} onClick={() => route("/device")}>
                        {t("back")}
                    </Button>
                </Stack>
            </Box>
        )
    }

    renderCredentialsForm(): React.JSX.Element {
        const {t} = useTranslation();

        return (
            <Box component="form" onSubmit={async e => {
                e.preventDefault();
                this._connTry++;
                await this.props.wifiSvc.requestWiFiConnect(this.state.credentials);
            }}>
                <Stack direction={"column"} spacing={1}>
                    {this.props.wifiSvc.connStatus == WiFiSvc.ConnStatus.DISCONNECTED && this._connTry > 0 &&
                        <Typography variant={"subtitle1"} color={"error"}>
                            {t("connFailed")}
                        </Typography>
                    }
                    <TextField required autoFocus
                               label={t("password")}
                               variant="outlined"
                               type={"password"}
                               value={this.state.credentials.password}
                               disabled={this.props.wifiSvc.connStatus == WiFiSvc.ConnStatus.CONNECTING}
                               onChange={e => this.setState({
                                   credentials: {
                                       ...this.state.credentials,
                                       password: (e.target as HTMLInputElement).value
                                   }
                               })}
                    />
                    <Button variant={"contained"}
                            type={"submit"}
                            startIcon={this.props.wifiSvc.connStatus == WiFiSvc.ConnStatus.CONNECTING ?
                                <CircularProgress size={20}/> : <WiFiIcon/>}
                            disabled={!this.state.credentials.password.length || this.props.wifiSvc.connStatus == WiFiSvc.ConnStatus.CONNECTING}
                    >
                        {this.props.wifiSvc.connStatus == WiFiSvc.ConnStatus.CONNECTING ? t("connectingTo") : t("connectTo")} {this.state.credentials.ssid}
                    </Button>
                    <Button variant={"outlined"}
                            startIcon={<ArrowBackIcon/>}
                            disabled={this.props.wifiSvc.connStatus == WiFiSvc.ConnStatus.CONNECTING}
                            onClick={() => {
                                this._connTry = 0;
                                this.setState({
                                    credentials: {ssid: "", password: ""},
                                });
                            }}>
                        {t("otherNetwork")}
                    </Button>
                </Stack>
            </Box>
        )
    }

    renderConnected(): React.JSX.Element {
        const {t} = useTranslation();

        return (
            <Stack direction={"column"} spacing={1}>
                {this.props.wifiSvc.connectedSSID &&
                    <Typography variant={"subtitle1"} sx={{mb: 2}}>
                        <WiFiIcon sx={{verticalAlign: "middle"}}/>&nbsp;
                        {t("connectedTo")}&nbsp;<b>{this.props.wifiSvc.connectedSSID}</b>
                    </Typography>
                }
                <Button variant={"contained"}
                        onClick={() => {
                            this._connTry = 0;
                            this.setState({
                                credentials: {ssid: "", password: ""},
                            });
                            this.props.wifiSvc.requestWiFiDisconnect();
                        }}
                        disabled={this.props.wifiSvc.connectedSSID == ""}
                >
                    {t("disconnect")}
                </Button>
                <Button variant={"outlined"} startIcon={<ArrowBackIcon/>} onClick={() => route("/device")}>
                    {t("back")}
                </Button>
            </Stack>
        )
    }

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
                    {t("noBluetoothConnection")}. <br/>
                    {t("clickTo")} <Link href={"/device/"}>{t("connect").toLowerCase()}</Link>.
                </Box>
                :
                <Stack direction={"column"} spacing={1}>
                    {
                        this.props.wifiSvc.connStatus != WiFiSvc.ConnStatus.CONNECTED &&
                        this.state.credentials.ssid == "" &&
                        this.renderSSIDChooser()
                    }
                    {
                        this.props.wifiSvc.connStatus != WiFiSvc.ConnStatus.CONNECTED &&
                        this.state.credentials.ssid != "" &&
                        this.renderCredentialsForm()
                    }
                    {
                        this.props.wifiSvc.connStatus == WiFiSvc.ConnStatus.CONNECTED &&
                        this.renderConnected()
                    }
                </Stack>
            }
        </Grid>;
    }
}