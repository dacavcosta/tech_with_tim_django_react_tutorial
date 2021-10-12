import React, { Component } from 'react';
import { 
    BrowserRouter as Router, 
    Switch, 
    Route, 
    Link, 
    Redirect ,
} from "react-router-dom";

import CreateRoomPage from './CreteRoomPage';
import RoomJoinPage from "./RoomJoinPage";
import Room from './room';

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Router>
            <Switch>
                <Route exact path="/"><p>This is the HomePage</p></Route>
                <Route path="/room/:roomCode" component={Room} />
                <Route path="/create" component={CreateRoomPage}/>
                <Route path="/join" component={RoomJoinPage}/>
            </Switch>
        </Router>;
    }
}