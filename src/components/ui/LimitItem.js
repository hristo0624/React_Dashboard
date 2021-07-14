import React, { Component } from "react";
import TextIcon from "./TextIcon";


export default class LimitItem extends Component {
	constructor(props) {
    super(props);
    
    this.state = {
      noLimit: true,
      isValid: false,
      limitValue: '',
      showError: false
    }
  }
  
  _changeLimit = (event) => {
    this.setState({noLimit: !this.state.noLimit});
    if (this.state.noLimit == false) {
      this.setState({showError: false});
      this.props.onChange(this.props.id, 0); //Set No limit value
    } else {
      if (this.state.limitValue == parseInt(this.state.limitValue, 10) && parseInt(this.state.limitValue) > 0) {
        this.props.onChange(this.props.id, parseInt(this.state.limitValue));
      } else {
        this.props.onChange(this.props.id, -1);
        this.setState({showError: true});
      }
    }
  }

  _changeTextInput = (event) => {
    let value = event.target.value;
    this.setState({limitValue: value});
    
    if (value == parseInt(value, 10) && parseInt(value) > 0) {
      this.setState({isValid: true, showError: false});
      this.props.onChange(this.props.id, parseInt(value));
    } else {
      this.setState({isValid: false});
      this.props.onChange(this.props.id, -1);
      if (this.state.noLimit == false) {
        this.setState({showError: true});
      } else {
        this.setState({showError: false});
      }
    }
  }

  componentDidMount() {
    const {value} = this.props;
    if (value == 0) {
      this.setState({noLimit: true, showError: false});
    } else if (value == parseInt(value, 10) && parseInt(value) > 0){
      this.setState({noLimit: false, limitValue: value});
    } else {
      this.setState({noLimit: true, showError: false});
    }
  }

	render() {
		const {optional, errorMessage} = this.props;
		// let isValid = (this.props.isValid == null) ? true : this.props.isValid;
		// const validityMessage = (isValid == false) ? <span className="item-label-validity">{this.props.validityMessage}</span> : null;
    // const isRequired = optional ? <span className="item-label-validity">*</span> : null
    
    let Icon = this.state.noLimit == true ? <TextIcon icon='check' /> : null;
		return (
			<div className="limit-item-wrapper">
        <label className="item-label">
          <span>{this.props.label}</span>
          {
            this.state.showError ? 
            <span className={'item-label-validity'}>{this.props.errorMessage}</span> : null
          }
        </label>
        <div className={'checkbox'}>
          <input id={this.props.id} type='checkbox' className='checkbox-input' value={true} checked={this.state.noLimit} onChange={(event)=>{this._changeLimit(event)}} />
          <label htmlFor={this.props.id} className='checkbox-description'><span className='checkbox-overlay'>{Icon}</span><span>{this.props.noLimitMessage}</span></label>
          <input
            className={`input-limit ${this.state.noLimit ? 'mod-inactive' : ''}`}
            onChange={(event)=>{this._changeTextInput(event)}}
            placeholder={this.props.placeholder}
            disabled={this.state.noLimit}
            value={this.state.limitValue}
          />
        </div>
      </div>
		);
	}
}

