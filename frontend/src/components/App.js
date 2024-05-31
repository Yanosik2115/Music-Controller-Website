import React, { Component } from "react";
import HomePage from "./HomePage";
import { render } from "react-dom";

export default class App extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="center">
				<HomePage />
			</div>
		);
	}
}

const container = document.getElementById("app");
render(<App tab="home" />, container);
