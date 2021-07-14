import React, { Component } from "react";
import DataHandler from '../utils/DataHandler';

export default class DatasheetRessource extends Component {
	constructor(props) {
		super(props);
		this.DataHandler = DataHandler;		
		const isValid = (props.value != null) ? true : false
		this.state = {
			isValid: props.isValid,
			validityMessage: 'Eingabe ungültig'
		}
		this.isEdited = false;
		this.emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	}

	validate(value){
		if(this.props.config.optional){
			this.setState({
				isValid: true
			});
			return true;
		}
		
		if(value === null || value === '' || (Array.isArray(value) && value.length == 0) || value === undefined){
			this.setState({
				isValid: false
			});
			return false;
		} else if(Array.isArray(value) && value.length > 0) {
			let result = true;
			value.forEach(item => {
				if (Array.isArray(item) && item.length > 0) {
					item.forEach(subItem => {
						if (subItem.key && subItem.key == 'email_address') {
							if (this.emailPattern.test(subItem.value) == false) {
								result = false;
							}
						}
					})
				}
			});
			
			if (result == false) {
				this.setState({
					isValid: false
				});
				return false;
			} else {
				this.setState({
					isValid: true
				});
				return true;
			}
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

	onChange(value, id = null, additionValue = null, additionEditied = false, additionValid = -1){
		this.isEdited = true;
		let isValid = false;
		
		isValid = this.validate(value);
		
		if (additionValid != -1 && additionValid == false)
			isValid = false;
		let result = Object.assign({}, this.props.config);
		result.value = value;
		result.isEdited = this.isEdited;
		if (additionValue != null && additionEditied == true)
			result.additionValue = additionValue;
		if(id){
			result.id = id;
		}		
		result.isValid = isValid;
		this.props.onChange(result);
	}

	render() {
		return null
	}
}