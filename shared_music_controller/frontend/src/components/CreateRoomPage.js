import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

export default class CreateRoomPage extends Component {
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => {},
    };

    constructor(props) {
        super(props);
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
            successMsg: "",
            errorMsg: "",
        };

        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.handleCreateButtomPress = this.handleCreateButtomPress.bind(this);
        this.handleUpdateButtomPress = this.handleUpdateButtomPress.bind(this);
    }

    handleVotesChange(e) {
        this.setState({
            votesToSkip:  e.target.value
        });
    }

    handleGuestCanPauseChange(e) {
        this.setState({
            guestCanPause: e.target.value == 'true' ? true : false
        });
    }

    handleCreateButtomPress() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
            })            
        };
        fetch('/api/create-room', requestOptions)
        .then((response)=> response.json())
        .then((data) => this.props.history.push(`/room/${data.code}`));
    }

    handleUpdateButtomPress() {
        const requestOptions = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode,
            })            
        };
        fetch('/api/update-room', requestOptions)
        .then((response)=> {
            if (response.ok){
                this.setState({
                    successMsg: "Room updated!"
                });
            } else {
                this.setState({
                    errorMsg: "An error has occurred while updating the room."
                });
            }
            console.log('call callback back');
            this.props.updateCallback();
        });
    }

    renderCreateButtons() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.handleCreateButtomPress}>
                        Create a Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="outlined" to="/" component={Link}>
                        Go back
                    </Button>
                </Grid>
            </Grid>
        );
    }

    renderUpdateButton() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={this.handleUpdateButtomPress}>
                        Update Room
                    </Button>
                </Grid>
            </Grid>
        );
    }

    render() {
        const title = this.props.update ? "Update Room" : "Create a Room";

        return <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={this.state.errorMsg != "" || this.state.successMsg != ""}>
                    {this.state.successMsg != ""? 
                        (
                            <Alert severity="success" onClose={() => {this.setState({successMsg: ""})}}>
                                {this.state.successMsg}
                            </Alert>
                        ) : 
                        (
                            <Alert severity="error" onClose={() => {this.setState({errorMsg: ""})}}>
                                {this.state.errorMsg}
                            </Alert>
                        )
                    }
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component='h4' variant='h4'>
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <Typography component='h6' variant='h6'>
                        Guest can pause
                    </Typography>
                    <RadioGroup row 
                        defaultValue={this.props.guestCanPause.toString()} 
                        onChange={this.handleGuestCanPauseChange}>
                        <FormControlLabel value="true" 
                            control={<Radio color="primary" />}
                            label="Yes"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel value="false" 
                            control={<Radio color="secondary" />}
                            label=" No"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                    <FormHelperText>
                        <div align="center">
                            Guest control of playback state
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField 
                        required={true} 
                        type="number" 
                        onChange={this.handleVotesChange}
                        defaultValue={this.state.votesToSkip}
                        inputProps={{
                            min: 1,
                            style: {textAlign:"center"},
                        }}
                    />
                    <FormHelperText>
                        <div align="center">
                            Votes requited to skip song
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {this.props.update ? this.renderUpdateButton() : this.renderCreateButtons()}
        </Grid>;
    }
}