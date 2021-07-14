import React, { Component } from "react";
import DatasheetRessource from './DatasheetRessource';
import TextProperty from '../ui/TextProperty';
import Checkbox from '../ui/Checkbox';
import Item from '../ui/Item';

export default class DatasheetBoolean extends DatasheetRessource {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const {value} = this.props;
		console.log("Boolean Value ==== ", value);
		if (value && value == true) {
			this.onChange(value);
		}
	}

	render() {
		const {value, className, isEditable} = this.props;
		const {label, description} = this.props.config;

		if(isEditable){
			return(
				<Item label={label}>
					<Checkbox description={description} type='checkbox' onChange={(value)=>{this.onChange(value)}} placeholder={label} value={value} />
				</Item>
			)
		}
		else{
			return(
				<Item className={this.props.className} label={label}>
					<TextProperty label={label} value={`${value}${description}`} />
				</Item>
			)
		}
	}
}