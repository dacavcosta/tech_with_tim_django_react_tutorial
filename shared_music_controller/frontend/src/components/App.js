import React, { Component } from "react";
import { render } from "react-dom";

import HomePage from "./homePage";
import CreateRoomPage from "./CreateRoomPage";
import JoinRoomPage from "./JoinRoomPage";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div className="center">
                <p xs={12} align="center">
                    <h1>Welcome { this.props.name }!!</h1>
                    <h2>This is a <u>test</u> using <i>Django</i> and <i>React</i><b>JS</b></h2>
                </p>
                <HomePage />
            </div>
        );
    }
}

const appDiv = document.getElementById("app");
render(<App name="primate"/> , appDiv);