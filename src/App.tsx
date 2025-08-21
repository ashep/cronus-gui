import * as React from 'react';
import Router from 'preact-router';

import * as BTSvc from './service/Bluetooth';
import * as WiFiSvc from './service/WiFi';
import * as ConfigV1 from './service/ConfigV1';
import * as ConfigV2 from './service/ConfigV2';
import * as Config from './service/Config';

import Home from './routes/Home';
import WiFi from './routes/WiFi';
import Display from './routes/Display';
import Developer from './routes/Developer';
import Location from './routes/Location';

export default class App extends React.Component <{}, {}> {
    private readonly btSvc: BTSvc.Service;
    private readonly wifiSvc: WiFiSvc.Service;
    private readonly cfgSvcV1: ConfigV1.Service;
    private readonly cfgSvcV2: ConfigV2.Service;
    private readonly cfgSvc: Config.Service;

    constructor() {
        super();

        this.btSvc = new BTSvc.Service(0xffff);
        this.wifiSvc = new WiFiSvc.Service(this.btSvc);
        this.cfgSvcV1 = new ConfigV1.Service(this.btSvc);
        this.cfgSvcV2 = new ConfigV2.Service(this.btSvc);
        this.cfgSvc = new Config.Service(this.btSvc, this.cfgSvcV1, this.cfgSvcV2);
    }

    render() {
        return (
            <Router>
                <Home path={"/device"} bt={this.btSvc} cfg={this.cfgSvc}/>
                <WiFi path={"/device/wifi"} btConnStatus={this.btSvc.connStatus} wifiSvc={this.wifiSvc}/>
                <Display path={"/device/display"} btConnStatus={this.btSvc.connStatus} cfg={this.cfgSvc}/>
                <Developer path={"/device/developer"} btConnStatus={this.btSvc.connStatus} cfg={this.cfgSvc}/>
                <Location path={"/device/location"} btConnStatus={this.btSvc.connStatus} cfg={this.cfgSvc}/>
            </Router>
        );
    }
}
