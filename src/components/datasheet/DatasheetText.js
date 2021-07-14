import React, { Component } from "react";
import DatasheetRessource from './DatasheetRessource';
import TextProperty from '../ui/TextProperty';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Item from '../ui/Item';

export default class DatasheetText extends DatasheetRessource {
	constructor(props) {
		super(props);
		this.state = {
			isValid: props.isValid,
			validityMessage: 'Eingabe darf nicht leer sein'
		}
	}

	render() {
		const {value, className, isEditable} = this.props;
		const {label} = this.props.config;
		const placeholder = (this.props.config.optional) ? `${label} (optional)` : label;
		if(isEditable){
			return(
				<Item label={placeholder} isValid={this.state.isValid} validityMessage={this.state.validityMessage} optional={!this.props.config.optional}>
					<Textarea autoFocus={this.props.config.autoFocus} onChange={(value)=>{this.onChange(value)}} placeholder={placeholder} value={value} isValid={this.state.isValid} />
				</Item>
			)
		}
		else{
			return(
				<Item className={this.props.className} label={label}>
					<TextProperty label={label} value={value} />
				</Item>
			)
		}
	}
}