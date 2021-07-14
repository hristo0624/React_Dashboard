import React, { Component } from "react";
import DatasheetRessource from './DatasheetRessource';
import cmsConfig from '../../config/cmsConfig';
import TextProperty from '../ui/TextProperty';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Item from '../ui/Item';

export default class DatasheetReport  extends DatasheetRessource {
	constructor(props) {
		super(props);
		this.state = {
			isValid: props.isValid,
			validityMessage: 'Eingabe darf nicht leer sein'
		}
	}

	openLink(pdf){
		window.open(pdf);
	}

	render() {
		const {value, className, isEditable} = this.props;
		console.log("Report Value === ", value);
		const {label} = this.props.config;
		let reports = <h5>Keine Einträge vorhanden</h5>
		if(value.length > 0){
			reports = value.map((report, index)=>{
				const values = report.values.map((value, valueIndex)=>{
					return(
						<Item key={`report_${index}_${valueIndex}`} className={this.props.className} label={value.label}>
							<TextProperty value={value.value} />
						</Item>
					)
				})

				return (
					<div className='datasheetreport' key={`report_${index}`}>
						{values}
						<div>
							<Button onClick={()=>{this.openLink(report.pdf)}} title='Protokoll öffnen' icon='pdf'/>
						</div>
					</div>
				)			
			});
		}

		return(
			<div>{reports}</div>
		)
	}
}