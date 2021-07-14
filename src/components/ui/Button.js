import React, { Component } from "react";
import TextIcon from "./TextIcon";

export default class Button extends Component {
	constructor(props) {
		super(props);
	}

	onClick(){
		if(this.props.onClick){
			this.props.onClick();
			return;
		}
	}


	render() {
		
		if(this.props.text){
			return (
				<button type={this.props.type} form={this.props.form} title={this.props.title} className="button text" onClick={()=>{this.onClick()}}>
					<TextIcon icon={this.props.icon} />
					<span>{this.props.text}</span>
				</button>
			);	
		}
		
		return (
			<button type={this.props.type} form={this.props.form} title={this.props.title} className={`button ${(this.props.classes) ? this.props.classes : ''}`} onClick={()=>{this.onClick()}}>
				<TextIcon icon={this.props.icon} />
			</button>
		);	
	}
}

