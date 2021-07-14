import React, { Component } from "react";
import DatasheetRessource from './DatasheetRessource';
import TextProperty from '../ui/TextProperty';
import Input from '../ui/Input';
import Item from '../ui/Item';
import Button from '../ui/Button';

export default class DatasheetPassword extends DatasheetRessource {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			isValid: props.isValid,
			validityMessage: 'Eingabe darf nicht leer sein'
		}		
	}

	validate(value){

		if(value.length > 0 && value.length < 8){
			this.setState({
				isValid: false,
				validityMessage: 'Eingabe muss mindestens 8 Zeichen lang sein'
			});
			return false;
		}
		else{
			this.setState({
				validityMessage: ''
			});
		}

		if(this.props.datasheetId == null && value == ''){
			this.setState({
				isValid: false,
				validityMessage: 'Eingabe darf nicht leer sein'
			});
			return false;
		}		
		else{
			if(this.state.isValid == false){
				this.setState({
					isValid: true
				});
			}
			return true;
		}
	}

	generatePassword(size = 10){
		let password = '';
		for (var i = 0; i < size; i++) {
			const scope = parseInt(Math.random()*5);
			if(scope > 0 && scope <= 2){
				password += String.fromCharCode(parseInt(Math.random()*26) + 65);
			}
			else if(scope > 2){
				password += String.fromCharCode(parseInt(Math.random()*26) + 97);
			}
			else{
				password += parseInt(Math.random()*10);
			}
		}

		this.resetInput(password);
		super.onChange(password);
	}

	render() {
		const {className, isEditable} = this.props;
		const {label} = this.props.config;

		if(isEditable){
			return(
				<Item label={label} isValid={this.state.isValid} validityMessage={this.state.validityMessage}>
					<div className='datasheetpassword'>
						<Input
						type='text'
						onChange={(value)=>{this.onChange(value)}}
						placeholder={label}
						value={this.state.value}
						resetInput={resetInput => {this.resetInput = resetInput}}
						/>
						<Button icon='password' title='Passwort generieren' onClick={()=>{this.generatePassword()}} />
					</div>
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