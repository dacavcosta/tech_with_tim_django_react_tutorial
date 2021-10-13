import React, { Component } from 'react';
import { 
    BrowserRouter as Router, 
    Switch, 
    Route, 
    Link, 
    Redirect ,
} from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core'

import CreateRoomPage from './CreateRoomPage';
import JoinRoomPage from "./JoinRoomPage";
import Room from './Room';

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: null,
        };
        this.clearRoomCode = this.clearRoomCode.bind(this);
    }

    async componentDidMount() {
        await fetch('/api/user-in-room')
        .then((respose) => respose.json())
        .then((data) => {
            this.setState({
                roomCode: data.code
            });
        });
    }

    renderHomePage(){
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        Shared Music Controller
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button variant="contained" color="primary" to='/join' component={ Link }>
                            Join a Room
                        </Button>
                        <Button variant="outlined" color="primary" to='/create' component={ Link }>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    clearRoomCode() {
        this.setState({
            roomCode: null,
        });
    }

    render() {
        return <Router>
            <Switch>
                <Route exact path="/" render={ () => {
                    return this.state.roomCode? (
                    <Redirect to={`/room/${this.state.roomCode}`} />
                    ) : (
                        this.renderHomePage() 
                    );
                }}/>
                <Route path="/room/:roomCode" render={ (props) => {
                    return <Room {...props} leaveRoomCallback={ this.clearRoomCode } />
                }}/>
                <Route path="/create" component={CreateRoomPage}/>
                <Route path="/join" component={JoinRoomPage}/>
            </Switch>
        </Router>;
    }
}