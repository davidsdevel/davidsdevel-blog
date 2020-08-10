import React, {Component} from "react";
import Editor from "./editor";
import store from '../../../store';
import { adminHideLoad } from '../../../store/actions';

export default class Email extends Component {
	componentDidMount() {
    	store.dispatch(adminHideLoad());
 	}

 	render() {
 		return <Editor/>;
 	}
}
