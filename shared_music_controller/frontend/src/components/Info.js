import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid, Button, Typography, IconButton} from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

const pages = {
    JOIN: 'pages.join',
    CREATE: 'pages.create',
}

export default function Info(props){
    const [page, setPage] = useState(pages.JOIN);

    useEffect(() => {
        console.log("Ran");
        return () => console.log("Cleanup");
    });

    function joinInfo() {
        return "Join Page"
    }

    function createInfo() {
        return "Create Page"
    }

    const changePage = function changePage() {
        page === pages.JOIN ? setPage(pages.CREATE) : setPage(pages.JOIN)
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    What is Shared Music Controller?
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="body1">
                    { page === pages.JOIN ? joinInfo() : createInfo() }
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <IconButton onClick={ changePage }>
                    { page === pages.JOIN ? <NavigateNextIcon/> : <NavigateBeforeIcon/> }
                </IconButton>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
    );
}

