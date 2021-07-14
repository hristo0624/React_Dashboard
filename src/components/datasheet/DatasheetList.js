import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import DragSortableList from 'react-drag-sortable';
import DatasheetRessource from './DatasheetRessource';
import DatasheetListElement from './DatasheetListElement';
import TextProperty from '../ui/TextProperty';
import Input from '../ui/Input';
import Item from '../ui/Item';
import Button from '../ui/Button';

@inject("store")
@observer
export default class DatasheetList extends DatasheetRessource {
	constructor(props) {
		super(props);
		this.store = props.store.appState;
		this.state = {
			listElements: props.value,
			isAddingNewElement: false,
			isValid: props.isValid,
			validityMessage: 'Fügen Sie ein/mehrere Elemente hinzu'
		}
		if(props.config.setAdditonalList){
			props.config.setAdditonalList((value)=>{this.setAdditonalList(value)})
		}
		this.newElementValue = {};
	}

	sendToDatasheet(list){
		super.validate(list);
		super.onChange(list);
	}

	setAdditonalList(reference){
		if(this.props.config.key == reference.datasheetLink){
			let additionalList = this.props.config.additionalList;
			let listElements = this.state.listElements.slice(0);
			try {
				let tempAdditionalList = this.store.cmsData[reference.category].data.find(checklist => checklist[reference.key] == reference.id);
				tempAdditionalList = tempAdditionalList[this.props.config.additionalList.datasheetReference].slice(0);
				listElements.forEach((listElement, index)=>{
					listElement.forEach((item)=>{
						const itemIndex = tempAdditionalList.findIndex(element => element[additionalList.value] == item.id);
						if(itemIndex >= 0){
							listElements.splice(index);
						}
					})
				})
				additionalList.list = tempAdditionalList;

			} catch(e) {
				console.log(e);
				additionalList.list = [];
			}
			this.setState({
				additionalList: additionalList,
				listElements: listElements
			})
		}
	}

	onNewElementChange(value){
		value.isValid = (value.value != null || value.value != '') ? true : false;
		this.newElementValue[value.key] = value;
	}

	onChange(value){
		let list = this.state.listElements;
		list[value.index] = value.value;
		this.isEdited = true;
		const isValid = (value.isValid) ? super.validate(list) : false;
		let result = Object.assign({}, this.props.config);
		result.value = list;
		result.isEdited = this.isEdited;
		result.isValid = isValid;
		this.props.onChange(result);
	}

	onSort(sortedList, dropEvent){
		let list = [];
		sortedList.forEach((listElement)=>{
			list.push(this.state.listElements[listElement.content.key])
		});
		this.sendToDatasheet(list);
		this.setState({
			listElements: list
		});
	}

	openAddDialog(){
		this.newElementValue = [];
		this.setState({
			isAddingNewElement: true,
			isValid: true
		});
	}

	abortAddDialog(){
		this.setState({
			isAddingNewElement: false
		});
	}

	addListelement(){
		const newElementValue = Object.values(this.newElementValue);
		if(newElementValue.length == 0 || newElementValue.findIndex((element)=>{return element.isValid == undefined || element.isValid == false}) != -1){
			this.setState({
				isValid: false,
				validityMessage: 'Füllen Sie alle Eingabefelder aus'
			})
		}
		else{
			const list = [newElementValue].concat(this.state.listElements);
			this.sendToDatasheet(list);
			this.setState({
				listElements: list,
				isAddingNewElement: false
			});
		}
	}

	removeListElement(index){
		let list = this.state.listElements;
		list.splice(index, 1);
		this.sendToDatasheet(list);
		this.setState({
			listElements: list
		});
	}

	getNewElementDialog(){
		if(this.state.isAddingNewElement){
			const entires = (this.state.listElements.length > 0) ? this.state.listElements[0] : this.props.config.valueKeys;
			const dialogInputs = entires.map((entry, entryIndex)=>{
				const config = Object.assign({}, entry);
				config.autoFocus = (entryIndex === 0) ? true : false;
				config.currentList = this.state.listElements;
				if(this.props.config.additionalList){
					config.additionalList = this.props.config.additionalList;
				}
				return(
					<div className='datasheetlist-element-item' key={`${entryIndex}`}>
						{this.DataHandler.getComponent('', config, true, config.category, (value)=>{this.onNewElementChange(value)}).component}
					</div>
				)
			});

			return(
				<Item className={'mod-newelement'} label={this.props.config.newElementDialogLabel}>
					<div className='datasheetlist-element'>
						{dialogInputs}
						<div className="datasheetlist-element-buttonwrapper">
							<Button onClick={()=>{this.abortAddDialog()}} title='Abbrechen' icon='close'/>
							<Button onClick={()=>{this.addListelement()}} title='Hinzufügen' icon='add'/>
						</div>
					</div>
				</Item>
			)
		}
		else{
			return <Button onClick={()=>{this.openAddDialog()}} icon='add_list' title={this.props.config.newElementDialogLabel} />;
		}
	}

	render() {
		const {value, isEditable} = this.props;
		const {label, description} = this.props.config;

		if(isEditable){
			const listElements = this.state.listElements.map((listElement, index)=>{
				const listElementComp = (
					<DatasheetListElement
					value={listElement}
					index={index}
					isEditable={isEditable}
					config={this.props.config}
					onChange={(value)=>{this.onChange(value)}}
					removeListElement={(index)=>{this.removeListElement(index)}} />
					)
				return{
					content: (<div key={index}>{listElementComp}</div>),
					classes: ['datasheetlist-element']
				}
			});

			const newElementDialog = this.getNewElementDialog();

			return(
				<Item label={label} isValid={this.state.isValid} validityMessage={this.state.validityMessage} optional={!this.props.config.listOptional}>
					{newElementDialog}
					<div className='datasheetlist'>
						<DragSortableList items={listElements} moveTransitionDuration={0} onSort={(sortedList, dropEvent)=>{this.onSort(sortedList, dropEvent)}} type="vertical"/>
					</div>
				</Item>
			);
		}
		else{
			const listElements = this.state.listElements.map((listElement, index)=>{
				return <DatasheetListElement value={listElement} index={index} isEditable={isEditable} config={this.props.config} onChange={(value)=>{this.onChange(value)}} />
			});
			return(
				<Item  label={label}>
					<div className='datasheetlist'>
						{listElements}
					</div>
				</Item>
			);
		}
	}
}