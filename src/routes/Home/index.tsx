import * as React from 'react';
import {route} from "preact-router"

import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import WiFiIcon from "@mui/icons-material/Wifi";
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import EngineeringIcon from '@mui/icons-material/Engineering';

import {Service as BTSvc, ConnStatus as BTConnStatus} from "../../service/Bluetooth";
import {Service as ConfigSvc} from '../../service/ConfigV1';
import Bluetooth from '../../components/Bluetooth';

interface Props {
    btSvc: BTSvc
    cfgSvc: ConfigSvc
}

interface State {
}

export default class Home extends React.Component<Props, State> {
    render() {
        return <Grid container
                     spacing={0}
                     direction="column"
                     alignItems="center"
                     justifyContent="center"
                     sx={{minHeight: '100vh'}}
        >
            <CssBaseline/>

            <Box sx={{mb: 3}}>
                <Bluetooth path={"/bt"} btSvc={this.props.btSvc} cfgSvc={this.props.cfgSvc} />
            </Box>

            <Stack direction={"column"} spacing={1}>
                    {this.props.btSvc.connStatus == BTConnStatus.CONNECTED &&
                        <Button variant={"contained"} startIcon={<WiFiIcon/>} onClick={() => route("/device/wifi")}>
                            WiFi
                        </Button>
                    }
                    {this.props.btSvc.connStatus == BTConnStatus.CONNECTED &&
                        <Button variant={"contained"} startIcon={<DisplaySettingsIcon/>} onClick={() => route("/device/display")}>
                            Display
                        </Button>
                    }

                    {this.props.btSvc.connStatus == BTConnStatus.CONNECTED && window.location.hash.indexOf("__dev") >= 0 &&
                        <Button variant={"contained"} startIcon={<EngineeringIcon/>} onClick={() => route("/device/developer")}>
                            Dev area
                        </Button>
                    }
            </Stack>
        </Grid>;
    }
}