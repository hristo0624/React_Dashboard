import React, { Component } from "react";
import cmsConfig from '../../config/cmsConfig';
import moment from 'moment';

import DatasheetText from "../datasheet/DatasheetText";
import DatasheetBoolean from "../datasheet/DatasheetBoolean";
import DatasheetDays from "../datasheet/DatasheetDays";
import DatasheetReference from "../datasheet/DatasheetReference";
import DatasheetSearch from "../datasheet/DatasheetSearch";
import DatasheetList from "../datasheet/DatasheetList";
import DatasheetSelectable from "../datasheet/DatasheetSelectable";
import DatasheetPassword from "../datasheet/DatasheetPassword";
import DatasheetUnique from "../datasheet/DatasheetUnique";
import DatasheetEmail from "../datasheet/DatasheetEmail";
import DatasheetReport from "../datasheet/DatasheetReport";
import DatasheetSortPoints from '../datasheet/DatasheetSortPoints';
import { propTypes } from "mobx-react";

class DataHandler{
	constructor() {

	}

	static translateSpecialTerm(value){
		return (cmsConfig.specialTerms[value]) ? cmsConfig.specialTerms[value] : value;
	}

	static inspectionDaysToString(inspectionDays){
		const limit = inspectionDays.length -1;
		return inspectionDays.map((day, index)=>{
			if(/\D{2}/.test(day)){
				day = `${day[0].toUpperCase()}${day[1]}`
			}
			if(index == 0)
				return day;
			return ` ${day}`;
		})
	}

	static createResultObject(data, path){
		path = path.split('.');
		let length = path.length - 1;
		let result = null;
		let key = null;
		let obj = null;
		while(length >= 0){
			key = path[length];
			if(result == null){
				result = {};
				result[key] = data;
			}
			else{
				obj = {};
				obj[key] = result;
				result = obj;
			}
			length--;
		}
		return result;
	}

	static resolvePath(object, path, defaultValue){
		if(object === Object(object)){
			const result = path.split('.').reduce((value, key) => {
				if(Array.isArray(value) && value.length > 0){
					value = value[0];
				}
				return value ? value[key] : defaultValue
			}, 
			object);
			return result;
		}
		else{
			return object;
		}
	}

	static getText(data, keys, isTranslateSpecialTerms = false){
		try {
			let result = '';
			let resolvedValue = null;
			keys.forEach((key, index)=>{
				resolvedValue = this.resolvePath(data, key);
				resolvedValue = (isTranslateSpecialTerms) ? this.translateSpecialTerm(resolvedValue): resolvedValue;
				if(resolvedValue != data){
					result += (resolvedValue) ? `${resolvedValue} ` : '';
				}
				else{
					result = data;
				}
			});
			result = result.replace(/\s+$/, '');
			return result;
		} catch(e) {
			return '';
		}
	}

	static getTimestamp(data, keys){
		const result =`${moment(this.resolvePath(data, keys[0])).format('DD.MM.YY - H:mm:ss')}`;
		return (result) ? result : '';
	}

	static getBool(data, keys){
		const result = this.resolvePath(data, keys[0]);
		return (result === true | result === false) ? result : false;
	}

	static getDays(data, keys){
		const result = this.resolvePath(data, keys[0]);
		return (result) ? result : [];		
	}

	static getDate(data, keys){
		let result = this.resolvePath(data, keys[0]);
		result = this.inspectionDaysToString(result);
		result = result.join(', ');
		return result;
	}

	static getList(data, keys, id){
		try {
			let list = [];
			let listElement = [];
			data.forEach((dataElement)=>{
				listElement = [];
				keys.forEach((key)=>{
					key.value = this.getText(dataElement, key.valueKeys);
					if(key.type == 'reference'){
						key.id = dataElement[key.key];
					}
					listElement.push(Object.assign({}, key));
				})
				list.push(listElement);
			});
			return list;
		} catch(e) {
			return [];
		}		
	}

	static getPointList(data, key) {
		try {
			let list = [];
			let listElement = {};
			data.forEach((dataElement)=>{
				listElement = {...key};
				listElement.value = this.getText(dataElement, key.valueKeys);
				listElement.id = dataElement[key.key];
				list.push(listElement);
			});
			return list;
		} catch(e) {
			return []
		}
	}

	static getSelectable(data, keys, values){
		try {
			const result = this.resolvePath(data, keys[0]);
			let label = values.find((value)=>{return value.value == result || value.label.toLowerCase() == result.toLowerCase()});
			return label.label;
		} catch(e) {
			return '';
		}		
	}

	static getSelectAdditionalValue(data, keys) {
		try {
			let result = {};
			keys.forEach(key => {
				let oneValue = this.resolvePath(data, key);
				result[key] = oneValue ? oneValue : 0;
			})
			return result;
		} catch (e) {
			return {};
		}
	}

	static getAdditionalList(data, key){
		try {
			let result = this.resolvePath(data, key);
			result = result.splice(0)
			return result;
		} catch(e) {
			return [];
		}		
	}

	static getReports(data, keys){
		try {
			let list = [];
			let listElement = [];
			data.forEach((dataElement)=>{
				listElement = [];
				keys.forEach((key)=>{					
					if(key.type == 'reference'){
						key.id = dataElement[key.key];
					}
					else if(key.type == 'timestamp'){
						key.value = this.getTimestamp(dataElement, key.valueKeys);
					}
					else{
						key.value = this.getText(dataElement, key.valueKeys);
					}
					listElement.push(Object.assign({}, key));
				})
				console.log(">>>>>>>>> ", dataElement, keys);
				list.push({values: listElement, pdf: dataElement._links.self.pdf});
			});
			return list;
		} catch(e) {
			console.log("Get Reports Error === ", e);
			return [];
		}		
		
	}

	static validate(value, datasheetId){
		if(value == null || value == '' || value == []){
			if(datasheetId){
				return false;
			}
			else{
				return null;
			}
		}
		return true;
	}

	static getComponent(data, property, isEditable = false, category = '', onChange = (value)=>{}, datasheetId = null){
		let value = null;
		let isValid = false;
		let additionValue = {};
		switch (property.type) {
			case 'bool':
				value = DataHandler.getBool(data, property.valueKeys);
				isValid = this.validate(value);
				if (data == undefined) {
					value = property.defaultValue;
				}
				return {
							config: property,
							isValid: isValid,
							value: value,
							component: <DatasheetBoolean
							key={property.key}
							isEditable={isEditable}
							config={property}
							value={value}
							onChange={onChange}
							isValid={isValid}
							/>
						}
				break;
			case 'days':
				value = DataHandler.getDays(data, property.valueKeys);
				isValid = this.validate(value);
				return {
							config: property,
							isValid: isValid,
							value: value,
							component: <DatasheetDays
							key={property.key}
							isEditable={isEditable}
							config={property}
							value={value}
							onChange={onChange}
							isValid={isValid}
							/>
						}
				break;
			case 'date':
				value = DataHandler.getDate(data, property.valueKeys);
				isValid = this.validate(value);
				return {
							config: property,
							isValid: isValid,
							value: value,
							component: <DatasheetText
							key={property.key}
							keyId={property.key}
							isEditable={isEditable}
							config={property}
							value={value}
							onChange={onChange}
							isValid={isValid}
							/>
						}
				break;
			case 'list':
				value = [];
				try {
					value = DataHandler.getList(data[property.key], property.valueKeys);
				} catch(e) {
					value = [];
				}
				if(property.additionalList){
					property.additionalList.list = this.getAdditionalList(data, property.additionalList.path);
				}
				isValid = this.validate(value);
				return {
							config: property,
							isValid: isValid,
							value: value,
							component: <DatasheetList
							key={property.key}
							isEditable={isEditable}
							config={property}
							value={value}
							onChange={onChange}
							isValid={isValid}
							/>
						}
				break;
			case 'password':
				value = DataHandler.getText(data, property.valueKeys)
				isValid = this.validate(value);
				return {
							config: property,
							isValid: isValid,
							value: value,
							component: <DatasheetPassword
							key={property.key}
							keyId={property.key}
							isEditable={isEditable}
							config={property}
							value={value}
							onChange={onChange}
							isValid={isValid}
							datasheetId={datasheetId}
							/>
						}
				break;
			case 'unique':
				value = DataHandler.getText(data, property.valueKeys);
				isValid = this.validate(value);
				return {
							config: property,
							isValid: isValid,
							value: value,
							component: <DatasheetUnique
							key={property.key}
							keyId={property.key}
							isEditable={isEditable}
							config={property}
							category={category}
							value={value}
							onChange={onChange}
							isValid={isValid}
							datasheetId={datasheetId}
							/>
						}
				break;
			case 'email':
				value = DataHandler.getText(data, property.valueKeys);
				isValid = this.validate(value);
				return {
							config: property,
							isValid: isValid,
							value: value,
							component: <DatasheetEmail
							key={property.key}
							keyId={property.key}
							isEditable={isEditable}
							config={property}
							category={category}
							value={value}
							onChange={onChange}
							isValid={isValid}
							datasheetId={datasheetId}
							/>
						}
				break;
			case 'reference':
				value = DataHandler.getText(data, property.valueKeys);
				isValid = this.validate(value);
				return {
							config: property,
							isValid: isValid,
							value: value,
							component: <DatasheetReference
							key={property.key}
							isEditable={isEditable}
							config={property}
							value={value}
							category={category}
							onChange={onChange}
							isValid={isValid}
							/>
						}
				break;
			case 'search':
				value = DataHandler.getText(data, property.valueKeys);
				isValid = this.validate(value);
				return {
							config: property,
							isValid: isValid,
							value: value,
							component: <DatasheetSearch
							key={property.key}
							isEditable={isEditable}
							config={property}
							value={value}
							category={category}
							onChange={onChange}
							isValid={isValid}
							/>
						}
				break;
			case 'selectable':
				value = DataHandler.getSelectable(data, property.valueKeys, property.values);
				additionValue = DataHandler.getSelectAdditionalValue(data, property.additionValueKeys);
				isValid = this.validate(value);
				return {
							config: property,
							isValid: isValid,
							value: value,
							component: <DatasheetSelectable
								key={property.key}
								keyId={property.key}
								isEditable={isEditable}
								config={property}
								value={value}
								onChange={onChange}
								isValid={isValid}
								additionValue={additionValue}
							/>
						}
				break;
			case 'text':
				value = DataHandler.getText(data, property.valueKeys, property.translate);
				isValid = this.validate(value);
				return {
							config: property,
							isValid: isValid,
							value: value,
							component: <DatasheetText
							key={property.key}
							keyId={property.key}
							isEditable={isEditable}
							config={property}
							value={value}
							onChange={onChange}
							isValid={isValid}
							/>
						}
				break;
			case 'timestamp':
				value = DataHandler.getTimestamp(data, property.valueKeys);
				isValid = this.validate(value);
				return {
							config: property,
							isValid: isValid,
							value: value,
							component: <DatasheetText
							key={property.key}
							keyId={property.key}
							isEditable={isEditable}
							config={property}
							value={value}
							onChange={onChange}
							isValid={isValid}
							/>
						}
				break;
			case 'report':
				value = [];
				try {
					value = DataHandler.getReports(data[property.key], property.valueKeys);
				} catch(e) {
					value = [];
				}				
				return {
							config: property,
							isValid: isValid,
							value: value,
							component: <DatasheetReport
							key={property.key}
							keyId={property.key}
							config={property}
							value={value}
							onChange={onChange}
							/>
						}
				break;
			case 'point':
				value = [];
				try {
					value = DataHandler.getPointList(data[property.key], property.valueKeys);
				} catch(e) {
					value = [];
				}
				
				isValid = this.validate(value);
				return {
							config: property,
							isValid: isValid,
							value: value,
							component: <DatasheetSortPoints
								key={property.key}
								isEditable={isEditable}
								config={property}
								value={value}
								category={category}
								onChange={onChange}
								isValid={isValid}
							/>
						}
			case 'none':
				return null;
			default:
				value = DataHandler.getText(data, property.valueKeys, property.translate);
				isValid = this.validate(value);
				return {
							config: property,
							isValid: isValid,
							value: value,
							component: <DatasheetText
							key={property.key}
							keyId={property.key}
							isEditable={isEditable}
							config={property}
							value={value}
							onChange={onChange}
							isValid={isValid}
							/>
						}
				break;
		}
	}
}

export default DataHandler;