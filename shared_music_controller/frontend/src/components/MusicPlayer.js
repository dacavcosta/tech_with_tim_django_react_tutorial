import React, { Component } from 'react';
import { 
    Grid,
    Typography,
    Card,
    IconButton,
    LinearProgress
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

export default class MusicPlayer extends Component {
    constructor(props) {
        super(props);
    }

    skipSong(){
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'}
        }
        fetch('/spotfy/skip-song', requestOptions);
    }

    pauseSong(){
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type' : 'application/json'}
        }
        fetch('/spotfy/pause-song', requestOptions);
    }

    playSong(){
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type' : 'application/json'}
        }
        fetch('/spotfy/play-song', requestOptions);
    }

    render () {
        const songProgress = (this.props.time / this.props.duration) * 100;

        return(
            <Card>
                <Grid container alignItems="center">
                    <Grid item align="center" xs={4}>
                        <img src={this.props.image_url} height="100%" width="100%" />
                    </Grid>
                    <Grid item align="center" xs={8}>
                        <Typography component="h5" variant="h5">
                            {this.props.title}
                        </Typography>
                        <Typography color="textSecondary" variant="subtitle1">
                            {this.props.artist}
                        </Typography>
                        <div>
                            <IconButton onClick={() => this.props.is_playing? this.pauseSong() : this.playSong()}>
                                {this.props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton>
                            <IconButton onClick={() => this.skipSong()}>
                                <SkipNextIcon /> 
                            </IconButton>                        
                        </div>
                        <Typography component="h6" variant="h6">
                            {this.props.votes} / {this.props.votes_required}
                        </Typography>    
                    </Grid>
                </Grid>
                <LinearProgress variant="determinate" value={ songProgress } />
            </Card>
        );
    }
}