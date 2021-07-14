import React, { Component } from "react";
import { Route, Link, withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import LazyRoute from "lazy-route";
import DevTools from "mobx-react-devtools";

import TopBar from "./TopBar";
import Login from "./Login";
import Home from "./Home";

@withRouter
@inject("store")
@observer
export default class App extends Component {
	constructor(props) {
		super(props);
		this.store = this.props.store;
	}
	authenticate(e) {
		if (e) e.preventDefault();
	}
	render() {
		const {jwt} = this.store.appState;
		if(jwt === null){
			return (
				<div className="wrapper">
					<TopBar />
					<Login />
				</div>
			);
		}
		return (
			<div className="wrapper">
				<TopBar />

				<Home />
			</div>
		);
	}
}
