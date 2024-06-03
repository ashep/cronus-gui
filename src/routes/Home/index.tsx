import * as React from 'react';
import {route} from "preact-router"

import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import WiFiIcon from "@mui/icons-material/Wifi";

import {Service as BTSvc, ConnStatus as BTConnStatus} from "../../service/Bluetooth";
import Bluetooth from '../../components/Bluetooth';

interface Props {
    btSvc: BTSvc
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
                <Bluetooth path={"/bt"} btSvc={this.props.btSvc}/>
            </Box>

            <Stack direction={"column"} spacing={1}>
                    {this.props.btSvc.connStatus == BTConnStatus.CONNECTED &&
                        <Button variant={"contained"} startIcon={<WiFiIcon/>} onClick={() => route("/device/wifi")}>
                            WiFi settings
                        </Button>
                    }
            </Stack>
        </Grid>;
    }
}