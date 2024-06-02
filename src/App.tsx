import * as React from 'react';
import Router from 'preact-router';

import * as BTSvc from './service/Bluetooth';
import * as WiFiSvc from './service/WiFi';

import Home from './routes/Home';
import WiFi from './routes/WiFi';

export default class App extends React.Component <{}, {}> {
    private readonly btSvc: BTSvc.Service;
    private readonly wifiSvc: WiFiSvc.Service;

    constructor() {
        super();

        this.btSvc = new BTSvc.Service(0xffff);
        this.wifiSvc = new WiFiSvc.Service(this.btSvc);
    }

    render(): JSX.Element {
        return (
            <Router>
                <Home path={"/"} btSvc={this.btSvc}/>
                <WiFi path={"/wifi"} btConnStatus={this.btSvc.connStatus} wifiSvc={this.wifiSvc}/>
            </Router>
        );
    }
}
