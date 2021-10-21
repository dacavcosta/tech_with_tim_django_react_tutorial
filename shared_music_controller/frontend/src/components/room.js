import React, { Component } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';

import CreateRoomPage from './CreateRoomPage';
export default class Room extends Component {
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
            spotfyAuthenticated: false,
        };
        this.roomCode = this.props.match.params.roomCode;
        
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.authenticateSpotfy = this.authenticateSpotfy.bind(this);
        this.getRoomDetails();
    }

    getRoomDetails() {
        console.log('getRoomDetails')
        fetch('/api/get-room?code=' + this.roomCode)
    .then((response) => {
        if(!response.ok) {
            this.props.leaveRoomCallback();
            this.props.history.push('/')
        }
        return response.json();
    })
        .then((data) => {
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
            });
            if(this.state.isHost) {
                this.authenticateSpotfy();
            }            
        });
    }

    authenticateSpotfy(){
        fetch('/spotfy/is-authenticated')
        .then((response) => response.json())
        .then((data) => {
            this.setState({ spotfyAuthenticated: data.status});
            if (!data.status) {
                fetch('/spotfy/get-auth-url')
                .then((response) => response.json())
                .then((data => {
                    window.location.replace(data.url);
                }));
            }
        });
    }

    leaveButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type' : 'application/json' },
        }
        fetch('/api/leave-room', requestOptions)
        .then((_response) => {
            this.props.leaveRoomCallback();
            this.props.history.push('/')
        });
    }

    updateShowSettings(value) {
        this.setState({
            showSettings: value,
        });
    }

    renderSettings(){
        console.log("Go to Update", this.state);
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoomPage 
                        update={true} 
                        votesToSkip={ this.state.votesToSkip }
                        guestCanPause={ this.state.guestCanPause }
                        roomCode={ this.roomCode }
                        updateCallback={this.getRoomDetails}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="outlined" onClick={() => this.updateShowSettings(false)}>
                        Close
                    </Button>
                </Grid>
            </Grid>
        );
    }

    renderSettingsButton() {
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={() => this.updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        );
    }

    render() {
        if(this.state.showSettings){
            return this.renderSettings();
        }

        return <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Code: {this.roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Votes: {this.state.votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Guest can Pause: {this.state.guestCanPause? "Yes" : "No"}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Host: {this.state.isHost? "Yes" : "No"} 
                </Typography>
            </Grid>
            {this.state.isHost ? this.renderSettingsButton : null}
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick = { this.leaveButtonPressed }>
                    Leave Room
                </Button>
            </Grid>
        </Grid>;
    }
}
