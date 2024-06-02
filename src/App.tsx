import * as React from 'react';
import Router from 'preact-router';
import {Service as BTSvc} from './service/Bluetooth';
import {Service as WiFiSvc} from './service/WiFi';
import Home from './routes/Home';
import WiFi from './routes/WiFi';

interface Props {
}

interface State {
}

export default class App extends React.Component <Props, State> {
    private readonly btSvc: BTSvc;
    private readonly wifiSvc: WiFiSvc;

    constructor() {
        super();

        this.btSvc = new BTSvc(0xffff);
        this.wifiSvc = new WiFiSvc(this.btSvc);
    }

    render(): JSX.Element {
        return (
            <Router>
                <Home path={"/"} btSvc={this.btSvc}/>
                <WiFi path={"/wifi"} btSvc={this.btSvc} wifiSvc={this.wifiSvc}/>
            </Router>
        );
    }
}