import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import  { TextField, Button, Grid, Typography } from '@material-ui/core';


export default class JoinRoomPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roomCode: "",
            error: ""
        };
        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.handleJoinButtonClick = this.handleJoinButtonClick.bind(this);
    }

    handleTextFieldChange(e) {
        this.setState({
            roomCode: e.target.value,
        })
    }

    handleJoinButtonClick() {
        const requestOptions = {
            method : 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                code: this.state.roomCode,
            })
        };
        fetch('/api/join-room', requestOptions)
        .then((response) => {
            if (response.ok) {
                this.props.history.push(`/room/${this.state.roomCode}`)
            }
            else {
                this.setState({error:  "Room not found"})
            }
        }).catch((error) => console.log('error', error));
    }

    render() {
        return (
            <Grid container spacing={1} align="center">
                <Grid item xs={12}>
                    <Typography component="h4" variant="h4">
                        Join a Room
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        error={this.state.error}
                        label="Code"
                        placeholder="Enter a Room Code"
                        value={this.state.roomCode}
                        helperText={this.state.error}
                        variant="outlined" 
                        onChange={this.handleTextFieldChange} />
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={this.handleJoinButtonClick}>
                        Join
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="outlined" color="primary" to="/" component={Link}>
                        Go Back
                    </Button>
                </Grid>
                </Grid>
            </Grid>
        );
    }
}