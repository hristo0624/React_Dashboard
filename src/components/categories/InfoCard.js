import React, { Component } from "react";
import DataHandler from '../utils/DataHandler';

import Button from "../ui/Button";
import Item from "../ui/Item";
import TextProperty from "../ui/TextProperty";
import { SortableHandle} from 'react-sortable-hoc';

export default class InfoCard extends Component {
	constructor(props) {
		super(props);
	}

	onEdit(){
		this.props.edit(this.props.category, this.props.id);
	}

	onDelete(){
		this.props.delete(this.props.category, this.props.id , this.props.index);
	}

	openLink(url){
		window.open(url);
		return;
	}

	render() {
		const {data, properties, id, prefix, category, userrole} = this.props;

		let cardElements = properties.map((property)=>{
				return DataHandler.getComponent(data, property).component;
			}
		);

		if(category == 'reports'){
			return (
				<div id={`${prefix}-${id}`} className="infocard">
					{cardElements}
					<div className="infocard-button">
						<Button onClick={()=>{this.openLink(data._links.self.pdf)}} title='Protokoll öffnen' icon='pdf'/>
					</div>
				</div>
			);
		}

		// if (category == 'checkpoints') {
		// 	if(userrole == 'admin' || userrole == 'manager'){
		// 		const DragHandle = SortableHandle(() => <span>::</span>);
		// 		return (
		// 			<div id={`${prefix}-${id}`} className="infocard">
		// 				{cardElements}
		// 				<div className="infocard-button mod-editable">
		// 					<Button onClick={(e)=>{this.onDelete(e)}} title='Löschen' icon='trash'/>
		// 					<DragHandle />
		// 					<Button onClick={(e)=>{this.onEdit(e)}} title='Bearbeiten' icon='edit'/>
		// 				</div>
		// 			</div>
		// 		)
		// 	} else {
		// 		const DragHandle = SortableHandle(() => <span>::</span>);
				
		// 		return (
		// 			<div id={`${prefix}-${id}`} className="infocard">
		// 				{cardElements}
		// 				<div className="infocard-button">
		// 					<DragHandle />
		// 					<Button onClick={(e)=>{this.onEdit(e)}} title='Öffnen' icon='preview'/>
		// 				</div>
		// 			</div>
		// 		)
		// 	}
		// }

		if(userrole == 'admin' || userrole == 'manager' || userrole == 'owner_selfmanaged'){
			return (
				<div id={`${prefix}-${id}`} className="infocard">
					{cardElements}
					<div className="infocard-button mod-editable">
						<Button onClick={()=>{this.onDelete()}} title='Löschen' icon='trash'/>
						<Button onClick={()=>{this.onEdit()}} title='Bearbeiten' icon='edit'/>
					</div>
				</div>
			);
		}
		else{
			return (
				<div id={`${prefix}-${id}`} className="infocard">
					{cardElements}
					<div className="infocard-button">
						<Button onClick={()=>{this.onEdit()}} title='Öffnen' icon='preview'/>
					</div>
				</div>
			);
		}
		
	}
}