import React, { Component } from "react";

export default class TextIcon extends Component {
	constructor(props) {
		super(props);
	}

	setIcon(iconName){
		switch (iconName) {
			case 'logo':
				return 'l';
				break;
			case 'barcode':
				return '0';
				break;
			case 'check':
				return '1';
				break;
			case 'save':
				return '2';
				break;
			case 'more':
				return '3';
				break;				
			case 'problem':
				return '4';
				break;
			case 'comment':
				return '5';
				break;
			case 'camera':
				return '6';
				break;
			case 'photo':
				return '7';
				break;
			case 'sync':
				return '8';
				break;
			case 'loupe':
				return '9';
				break;
			case 'remove':
				return 'q';
				break;
			case 'close':
				return 'w';
				break;
			case 'logout':
				return 'e';
				break;
			case 'back':
				return 'r';
				break;
			case 'clipboard_check':
				return 't';
				break;
			case 'clipboard_upload':
				return 'z';
				break;
			case 'clipboard_text':
				return 'u';
				break;
			case 'clipboard_error':
				return 'i';
				break;
			case 'clipboard_empty':
				return 'o';
				break;
			case 'pdf':
				return 'p';
				break;
			case 'new':
				return 'a';
				break;
			case 'sort':
				return 's';
				break;
			case 'select_all':
				return 'd';
				break;
			case 'selected':
				return 'f';
				break;
			case 'empty_select':
				return 'y';
				break;
			case 'trash':
				return 'x';
				break;
			case 'edit':
				return 'c';
				break;
			case 'preview':
				return 'v';
				break;
			case 'add_list':
				return 'b';
				break;
			case 'add':
				return 'n';
				break;
			case 'password':
				return 'm';
				break;
			case 'download':
				return ',';
				break;
			default:
				return '';
				break;
		}
	}

	render() {
		let propStyles = {};
		if(this.props.color){
			propStyles.color = this.props.color;
		}
		if(this.props.fontSize){
			propStyles.fontSize = this.props.fontSize;
		}
		return (
			<span style={propStyles} className={(this.props.className) ? `texticon ${this.props.className}` : 'texticon'}>
				{this.setIcon(this.props.icon)}
			</span>
		);
	}
}