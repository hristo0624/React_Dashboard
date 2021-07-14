import React, { Component } from "react";

export default class Section extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {label} = this.props;

		return (
			<div className={'datasheet-section'}>
				<h4 className='datasheet-section-headline'>{label}</h4>
				<div className='datasheet-section-items'>
					{this.props.children}
				</div>
			</div>
		);
	}
}

