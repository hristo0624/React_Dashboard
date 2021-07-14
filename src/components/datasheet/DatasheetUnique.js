import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import DatasheetRessource from './DatasheetRessource';
import TextProperty from '../ui/TextProperty';
import Input from '../ui/Input';
import Item from '../ui/Item';
var seedrandom = require('seedrandom');

@inject("store")
@observer
export default class DatasheetUnique extends DatasheetRessource {
	constructor(props) {
		super(props);
		this.store = props.store.appState;
		this.state = {
			value: props.value,
			isValid: props.isValid,
			validityMessage: 'Eingegebener Wert wird bereits verwendet',
			defaultValue: props.value,
			uneditableValue: ''
		}
	}

	async checkIfExists(query){
		if(query == ''){
			return true;
		}
		try {
			const response = await this.store.checkIfExists(this.props.category, query);
			let result = [];
			if(response.status === 200){
				return (response.data.length > 0)			
			}
			return false;
		} catch(error) {
			alert(error);
		}		
	}	

	async onChange(value){
		this.setState({
			value: value.toLowerCase()
		})
		if(await this.checkIfExists(value) == false){
			super.onChange(value);
			if(this.state.isValid == false){
				this.setState({
					isValid: true
				})
			}
		}
		else{
			let isValid = false;
			if(value == ''){
				this.setState({
					validityMessage: 'Eingabe darf nicht leer sein',
					isValid: false
				});
				super.onChange(value);
			}
			if(this.props.datasheetId != null){
				if(value != this.state.defaultValue){
					this.setState({
						validityMessage: 'Eingegebener Wert wird bereits verwendet',
						isValid: false,
					});
				}
				else{
					isValid = true;
					this.setState({
						isValid: true
					});
				}
			}
			this.setState({
				validityMessage: 'Eingegebener Wert wird bereits verwendet',
				isValid: false,
			});
			let result = Object.assign({}, this.props.config);
			result.value = value;
			result.isEdited = this.isEdited;
			result.isValid = isValid;
			this.props.onChange(result);
		}
	}



	componentDidMount() {
		if (this.props.value) {
			this.setState({uneditableValue: this.props.value});
		} else {
			var initvalue = seedrandom(Date.now().toString(), {entropy: true});
			let numberValue = Math.floor(initvalue() * 100000);
			if (numberValue < 10000) {
				numberValue = '0' + numberValue;
			}
			console.log("Unique Value init Code ==== ", numberValue);
				this.setState({uneditableValue: 'AW' + numberValue});
			
			let result = Object.assign({}, this.props.config);
			result.value = 'AW' + numberValue;
			result.isEdited = true;
			result.isValid = true;
			this.props.onChange(result);
		}
	}

	render() {
		const {className, isEditable} = this.props;
		const {label} = this.props.config;

		if(isEditable){
			return(
				<Item label={label} isValid={this.state.isValid} validityMessage={this.state.validityMessage} optional={!this.props.config.optional}>
					<Input autoFocus={this.props.config.autoFocus} type='text' onChange={(value)=>{this.onChange(value)}} placeholder={label} value={this.state.value} isValid={this.state.isValid} />
				</Item>
			)
		}
		else{
			return(
				<Item className={this.props.className} label={label}>
					<TextProperty label={label} value={this.state.uneditableValue} />
				</Item>
			)
		}
	}
}