import * as React from 'react';
import Button from "@mui/material/Button";
import {useTranslation} from "react-i18next";
import {Service as BTSvc, ConnStatus as BTConnStatus} from "../../service/Bluetooth";
import {Service as ConfigSvc} from '../../service/ConfigV1';
import BluetoothIcon from "@mui/icons-material/Bluetooth";
import Typography from "@mui/material/Typography";

interface Props {
    btSvc: BTSvc
    cfgSvc: ConfigSvc
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
                <React.Fragment>
                    <Typography align={"center"} variant={"body1"}>
                        <BluetoothIcon sx={{verticalAlign: "middle"}}/>
                        <b>{this.props.btSvc.connectedDeviceName}</b>
                    </Typography>
                    <Typography align={"center"} variant={"body2"}>
                        (v{this.props.cfgSvc.FirmwareVersionString})
                    </Typography>
                </React.Fragment>

            }
        </React.Fragment>
    }
}