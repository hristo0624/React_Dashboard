import React, { Component } from "react";
import Input from "./Input";

export default class Datalist extends Component {
	constructor(props) {
		super(props);
	}

	generateRandomKey(){
		return Math.floor(Math.random()*Date.now())
	}

	onChange(value){
		this.props.onChange(value);
	}

	onBlur(event){
		if(this.props.onBlur){
			this.props.onBlur(event);
		}
	}
	onFocus(event){
		if(this.props.onFocus){
			this.props.onFocus(event);
		}
	}

	render() {
		const options = this.props.options.map((option)=>{
				option.label = (option.label != '') ? option.label : null;
				return <option key={this.generateRandomKey()} value={(option.label != null) ? `${option.displayedValue} [${option.label}]` : option.displayedValue}/>
			}
		);
		return(
			<div className='datalist'>
				<Input 
					value={this.props.value} 
					placeholder={this.props.placeholder}
					list={this.props.listName} 
					onChange={(event)=>{this.onChange(event)}} 
					onBlur={(event)=>{this.onBlur(event)}} 
					onFocus={(event)=>{this.onFocus(event)}}
					resetInput={this.props.resetInput}
					isValid={this.props.isValid}
					inputIcon='loupe'
					autoFocus={this.props.autoFocus}
					title={this.props.title}
					dataType={this.props.dataType}
				/>
				<datalist id={this.props.listName}>
					{options}
				</datalist>
			</div>
		)
	}
}

