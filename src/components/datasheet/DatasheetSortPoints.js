import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import cmsConfig from '../../config/cmsConfig';
import DatasheetRessource from './DatasheetRessource';
import TextProperty from '../ui/TextProperty';
import Datalist from '../ui/Datalist';
import Item from '../ui/Item';
import Input from '../ui/Input';
// import Checkbox from '../ui/Checkbox';
import Checkpoint from '../ui/Checkpoint';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import _ from 'lodash';
const arrayMove = require('array-move');


@inject("store")
@observer
export default class DatasheetSortPoints extends DatasheetRessource {
	constructor(props) {
		super(props);
    this.store = props.store.appState;
		this.state = {
			dataListOptions: [],
			isValid: props.isValid,
      validityMessage: 'Eingabe darf nicht leer sein',
      checkpoints: [],
      uncheckpoints: [],
      showAll: false,
      searchShow: false,
      searchResult: [],
      searchString: '',
      expandable: true,
    }
    console.log("Props. Value ==== ", props.value);
  }
  
  setInitialOptions(config) {
    try {
      console.log("CMS Data === ", this.store.cmsData[config.apiCategory], config.apiCategory);
      const { value } = this.props;
      let tempPoints = {};
      let initPoints = [];
      let initUncheckedPoints = [];
      let curPoints = [];
      if (value && value.length > 0) {
        curPoints = value;
      }

      if (curPoints.length > 0) { // When current elevator is edited and new elevator is added with latest elevator's checkpoints data
        curPoints.forEach(onePoint => {
          let newPoint = {
            // ...onePoint,
            show: true,
            chpo_id: onePoint.id,
            chpo_headline: onePoint.value
          }
          initPoints.push(newPoint);
          tempPoints[newPoint.chpo_id] = newPoint;
        })
        if (this.store.userrole != 'owner' && this.store.userrole != 'inspector') {
          let categoryData = this.store.cmsData[config.apiCategory].data.slice(0);
          categoryData.forEach(onePoint => {
            if (!tempPoints[onePoint.chpo_id] ) {
              let newPoint = {
                // ...onePoint,
                show: false,
                chpo_id: onePoint.chpo_id,
                chpo_headline: onePoint.chpo_headline
              }
              initUncheckedPoints.push(newPoint);
            }
          });
        }
        if (initPoints.length + initUncheckedPoints.length < 8) {
          this.setState({expandable: false});
        }
      } else { // When new elevator is added 
      let categoryData = this.store.cmsData[config.apiCategory].data.slice(0);
        categoryData.forEach(onePoint => {
          let newPoint = {
            // ...onePoint,
            chpo_id: onePoint.chpo_id,
            chpo_headline: onePoint.chpo_headline,
            show: onePoint.chpo_default == false ? false : true
          }
          tempPoints[onePoint.chpo_id] = newPoint;
        });
        const sortedArray = _.orderBy(tempPoints, ['chpo_default', 'chpo_sort'], ['desc', 'asc']);
        initPoints = _.filter(sortedArray, ['show', true]);
        initUncheckedPoints = _.filter(sortedArray, ['show', false]);
        let resultValue = [];
        initPoints.forEach(item => {
          let resultItem = {
            'chpo_id': item.chpo_id
          }
          resultValue.push(resultItem);
        })
        super.onChange(resultValue);
      }
      this.setState({checkpoints: initPoints, uncheckpoints: initUncheckedPoints});
      console.log("Init Points === ", initPoints);
    } catch(e) {
      console.log(e);
    }
  }

	onChange(value){
    console.log("On Change Value ==== ", value);
    let originalChecks = [...this.state.checkpoints];
    let originalUnchecks = [...this.state.uncheckpoints];
    if (value.show == true) {
      const removedArray = _.filter(originalChecks, (item) => {
        return item.chpo_id != value.chpo_id
      })
      let newValue = { ...value, show: false}      
      this.setState({checkpoints: removedArray, uncheckpoints: [newValue, ...this.state.uncheckpoints]}, () => {
        let resultValue = [];
        this.state.checkpoints.forEach(item => {
          let resultItem = {
            'chpo_id': item.chpo_id
          }
          resultValue.push(resultItem);
        })
        super.onChange(resultValue);
      });
    } else {
      const removedArray = _.filter(originalUnchecks, (item) => {
        return item.chpo_id != value.chpo_id
      })
      let newValue = { ...value, show: true}
      this.setState({checkpoints: [...this.state.checkpoints, newValue], uncheckpoints: removedArray}, () => {
        let resultValue = [];
        this.state.checkpoints.forEach(item => {
          let resultItem = {
            'chpo_id': item.chpo_id
          }
          resultValue.push(resultItem);
        })
        super.onChange(resultValue);
      });
    }

    // calculate(resultvalue) and super onChange call
  }
  
  onSearchChange = (value) => {
    if (value.length == 0) {
      this.setState({searchShow: false});
    } else {
      this.setState({searchShow: true, searchString: value.toLowerCase()});
    }
    
  }

  componentDidMount() {
    this.setInitialOptions(this.props.config);
  }
  
  onSortEnd = ({oldIndex, newIndex}) => {
    if (oldIndex == newIndex)
      return;
    
    console.log("Old, New === ", oldIndex, newIndex);
    this.setState({checkpoints: arrayMove(this.state.checkpoints, oldIndex, newIndex)}, () => {
      //calculate(resultJSON) and super onChange call
      let resultValue = [];
        this.state.checkpoints.forEach(item => {
          let resultItem = {
            'chpo_id': item.chpo_id
          }
          resultValue.push(resultItem);
        })
        super.onChange(resultValue);
    });
  }

  switchShow = () => {
    this.setState({showAll: !this.state.showAll});
  }

	render() {
		const {value, className, isEditable} = this.props;
		const {label, key} = this.props.config;
		const placeholder = (this.props.config.optional) ? `${label} (optional)` : label;
    const SortableItem = SortableElement(({value}) => 
        <div className='checkpoint-wrapper category-drag'>
            <Checkpoint id={value.chpo_id} description={value.chpo_headline} type='checkbox' prehidden={!value.show} mode={'point'} onChange={()=>{this.onChange(value)}} placeholder={this.props.label} value={value.show}/>
        </div>
    );

    const SortableList = SortableContainer(({items}) => {
      return (
        <div className="checkpoints">
          {items.map((value, index) => (
            <SortableItem key={index.toString()} index={index} value={value} />
          ))}
        </div>
      );
    });
  
		if(isEditable){
			return(
				<Item label={placeholder} isValid={this.state.isValid} validityMessage={this.state.validityMessage} optional={!this.props.config.optional}>
          <div className='datalist'>
            <Input 
              value={this.state.searchString} 
              placeholder={placeholder}
              list={key} 
              onChange={(event)=>{this.onSearchChange(event)}} 
              isValid={this.state.isValid}
              inputIcon='loupe'
              autoFocus={this.props.config.autoFocus}
              title={label}
            />
          </div>
          <div className={this.state.showAll == false ? 'list-wrapper' : ''}>
            {
              this.state.searchShow == false ? 
              <div>
                <SortableList items={this.state.checkpoints} onSortEnd={this.onSortEnd} lockAxis={'y'} distance={2}/>
                <div className="checkpoints">
                  {
                    this.state.uncheckpoints.map((value, index) => (
                      <div className='checkpoint-wrapper' key={index.toString()}>
                          <Checkpoint id={value.chpo_id} description={value.chpo_headline} type='checkbox' prehidden={!value.show} mode={'point'} onChange={()=>{this.onChange(value)}} value={value.show}/>
                      </div>
                    ))
                  }
                </div>
              </div>
              : 
              <div className="checkpoints">
                {
                  this.state.checkpoints.map((value, index) => {
                    const headline = value.chpo_headline.toLowerCase();
                    if (headline.indexOf(this.state.searchString) > -1) {
                      return (
                                <div className='checkpoint-wrapper' key={index.toString()}>
                                    <Checkpoint id={value.chpo_id} description={value.chpo_headline} type='checkbox' prehidden={!value.show} mode={'point'} onChange={()=>{this.onChange(value)}} value={value.show}/>
                                </div>
                              )
                    } else {
                      return null;
                    }
                  })
                }
                {
                  this.state.uncheckpoints.map((value, index) => {
                    const headline = value.chpo_headline.toLowerCase();
                    if (headline.indexOf(this.state.searchString) > -1) {
                      return (
                                <div className='checkpoint-wrapper' key={index.toString()}>
                                    <Checkpoint id={value.chpo_id} description={value.chpo_headline} type='checkbox' prehidden={!value.show} mode={'point'} onChange={()=>{this.onChange(value)}} value={value.show}/>
                                </div>
                              )
                    } else {
                      return null;
                    }
                    
                  })
                }
              </div>
            }
          </div>
          {
            this.state.expandable == true ?
            <div className={'expand-button'} onClick={() => { this.switchShow()}}>
              <div className='expand-line'></div>
              <div className='expand-text-wrapper'><label className={'expand-text'}>&nbsp;&nbsp;ALLE ANZEIGEN&nbsp;&nbsp;</label></div>
            </div>
            :
            null
          }
          
				</Item>
			)
		} else{
			return(
				<Item className={this.props.className} label={this.props.label}>
          <div className={this.state.showAll == false ? 'list-wrapper' : ''}>
            <div className="checkpoints">
              {
                this.state.checkpoints.map((value, index) => {
                  const headline = value.chpo_headline.toLowerCase();
                  if (headline.indexOf(this.state.searchString) > -1) {
                    return (
                              <div className='checkpoint-wrapper' key={index.toString()}>
                                  <Checkpoint id={value.chpo_id} description={value.chpo_headline} type='checkbox' prehidden={!value.show} mode={'point'} onChange={()=>{this.onChange(value)}} value={value.show} disabled={true}/>
                              </div>
                            )
                  } else {
                    return null;
                  }
                })
              }
              {
                this.state.uncheckpoints.map((value, index) => {
                  const headline = value.chpo_headline.toLowerCase();
                  if (headline.indexOf(this.state.searchString) > -1) {
                    return (
                              <div className='checkpoint-wrapper' key={index.toString()}>
                                  <Checkpoint id={value.chpo_id} description={value.chpo_headline} type='checkbox' prehidden={!value.show} mode={'point'} onChange={()=>{this.onChange(value)}} value={value.show} disabled={true}/>
                              </div>
                            )
                  } else {
                    return null;
                  }
                  
                })
              }
            </div>
          </div>
          {
            this.state.expandable == true ?
            <div className={'expand-button'} onClick={() => { this.switchShow()}}>
              <div className='expand-line'></div>
              <div className='expand-text-wrapper'><label className={'expand-text'}>&nbsp;&nbsp;ALLE ANZEIGEN&nbsp;&nbsp;</label></div>
            </div>
            :
            null
          }
				</Item>
			)
		}
	}
}