import React, { Component } from "react";
import TextIcon from "./TextIcon";

export default class Checkbox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: false,
      fullShow: false,
      prevId: null,
      prevValue: null,
      id: ''
		}
  }
  
  static getDerivedStateFromProps (props, state) {
    if (props.value != state.prevValue || props.id != state.prevId) {
      return {
        id: props.id,
        value: props.value
      }
    } else {
      return null;
    }
  }

	onChange(event){
    if (this.props.disabled && this.props.disabled == true)
      return;
    this.setState({value: !this.state.value})	
		this.props.onChange();
	}

	onMouseEnter = () => {
		this.setState({fullShow: true});
	}

	onMouseLeave = () => {
		this.setState({fullShow: false});
	}

	render() {
		const isChecked = (this.state.value && this.state.value != false) ? 'checked' : '';
		const description = (this.props.description) ? this.props.description : '';
		let Icon = (this.state.value && this.state.value != false) ? <TextIcon icon='check' /> : null;
		const {mode, prehidden} = this.props;
		
		const addItem = prehidden == false ? <span>&nbsp;≡&nbsp;</span> : <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>;

		return (
			<div className={this.state.fullShow == false ? 'checkbox' : 'checkbox-full'} onMouseEnter={() => {this.onMouseEnter()}} onMouseLeave={() => {this.onMouseLeave()}}>
				{mode == 'point' ? addItem : null }
				<input id={this.state.id} type='checkbox' className='checkbox-input' value={this.state.value} checked={isChecked} onChange={(event)=>{this.onChange(event)}} />
				<label htmlFor={this.state.id} className='checkbox-description'><span className='checkbox-overlay'>{Icon}</span><span>{description}</span></label>
			</div>
		);
	}
}