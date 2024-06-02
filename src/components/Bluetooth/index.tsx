import * as React from 'react';
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {useTranslation} from "react-i18next";
import {Service as BTSvc, ConnStatus as BTConnStatus} from "../../service/Bluetooth";
import BluetoothIcon from "@mui/icons-material/Bluetooth";
import Typography from "@mui/material/Typography";

interface Props {
    btSvc: BTSvc
}

export default class Home extends React.Component<Props, {}> {
    render(): React.JSX.Element {
        const {t} = useTranslation();

        return <React.Fragment>
                {this.props.btSvc.connStatus != BTConnStatus.CONNECTED
                    ?
                    <Button
                        variant={"contained"}
                        onClick={() => this.props.btSvc.connect()}
                        disabled={this.props.btSvc.connStatus == BTConnStatus.CONNECTING}
                        startIcon={<BluetoothIcon/>}
                    >
                        {this.props.btSvc.connStatus == BTConnStatus.CONNECTING ? t("connecting") : t("connect")}
                    </Button>
                    :
                    <Typography variant={"body1"}>
                        <BluetoothIcon sx={{verticalAlign: "middle"}}/>
                        <b>{this.props.btSvc.connectedDeviceName}</b>
                    </Typography>
                }
            </React.Fragment>
    }
}