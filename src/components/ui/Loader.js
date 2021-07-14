import React, { Component } from "react";
import Item from './Item';

export default class Loader extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="loader">
				<img src={require('../../images/loading.gif')} title={this.props.text} alt="Ein Aufzug der nach oben fährt"/>
				<p className="loader-text">{this.props.text}</p>
			</div>
		);
	}
}

