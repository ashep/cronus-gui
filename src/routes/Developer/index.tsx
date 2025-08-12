import * as React from "react";
import * as BTSvc from "../../service/Bluetooth";
import * as Config from "../../service/Config";

import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import {Link, route} from "preact-router";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Props {
    btConnStatus: BTSvc.ConnStatus
    cfg: Config.Service
}

interface State {
}

export default class Misc extends React.Component<Props, State> {
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
                    Click <Link href={"/device"}>here</Link> to connect.
                </Box>
                :
                <Stack direction={"column"} spacing={3}>
                    <FormControlLabel
                        label="Allow unstable releases"
                        control={
                            <Checkbox checked={this.props.cfg.AllowUnstableFirmware}
                                      onChange={(_, v) => this.props.cfg.SetAllowUnstableFirmware(v)}
                            />
                        }
                    />

                    <Button variant={"outlined"} startIcon={<ArrowBackIcon/>} onClick={() => route("/device/#__dev")}>
                        Back
                    </Button>
                </Stack>
            }
        </Grid>
    }
}