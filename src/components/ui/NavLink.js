import React, { Component } from "react";

export default class NavLink extends Component {
	constructor(props) {
		super(props);
	}

	onClick(event){
		if(this.props.onClick){
			this.props.onClick(event);
			return;
		}
	}

	render() {
		const className = (this.props.href == this.props.currentCategory) ? 'navlink active' : 'navlink';
		if(this.props.children){
			return (
				<a onClick={(event)=>{this.onClick(event)}} href={this.props.href} title={this.props.title} className={className}>
					{this.props.children}
					<span className='navlink-label' style={{padding: this.props.labelPadding, margin: this.props.labelMargin, }}>{this.props.label}</span>
				</a>
			);
		}
		return (
			<a onClick={(event)=>{this.onClick(event)}} href={this.props.href} title={this.props.title} className={className}>
				{this.props.label}
			</a>
		);
		
	}
}