import React, { Component } from "react";
import DatasheetRessource from './DatasheetRessource';
import TextProperty from '../ui/TextProperty';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Item from '../ui/Item';

export default class DatasheetEmail extends DatasheetRessource {
	constructor(props) {
		super(props);
		this.state = {
			isValid: props.isValid,
			validityMessage: 'Eingabe darf nicht leer sein'
		}
		this.emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	}

	validate(value){
		if(this.props.datasheetId == null && value == ''){
			this.setState({
				isValid: false,
				validityMessage: 'Eingabe darf nicht leer sein'
			});
			return false;
		}		
		else{
			if(this.emailPattern.test(value) == false){
				this.setState({
					isValid: false,
					validityMessage: 'Bitte geben Sie eine gültige E-Mail Adresse ein'
				});
				return false;
			}
			if(this.state.isValid == false){
				this.setState({
					isValid: true
				});
			}
			return true;
		}
	}

	render() {
		const {value, className, isEditable} = this.props;
		const {label} = this.props.config;
		if(isEditable){
			return(
				<Item label={label} isValid={this.state.isValid} validityMessage={this.state.validityMessage}>
					<Input autoFocus={this.props.config.autoFocus} type='text' onChange={(value)=>{this.onChange(value)}} placeholder={label} value={value} isValid={this.state.isValid} />
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