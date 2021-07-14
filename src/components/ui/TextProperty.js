import React, { Component } from "react";
import Item from './Item';

export default class TextProperty extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let value = '';
		try {
			value = this.props.value;
			value = (value == '' || value == null) ? '-' : this.props.value;
		} catch(e) {
			value = '-';
		}

		return (
			<p className={(this.props.className) ? `textproperty ${this.props.className}` : 'textproperty'} title={value}>{value}</p>

		);
	}
}

