import React from 'react';
import classes from '../../stylesheets/components/ui/Modal.module.css';
import Auxiliary from '../../hoc/Auxiliary';
import Backdrop from './Backdrop';

class Modal extends React.Component{
	shouldComponentUpdate(nextProps, nextState){
		return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
	}

	render(){
		return(
			<Auxiliary>
				<Backdrop show={this.props.show} clicked={this.props.modalClosed}/>
				<div
					className={classes.Modal}
					style={{
						transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
						opacity: this.props.show ? '1' : '0'
					}}>{this.props.children}</div>
			</Auxiliary>
		);
	}	
}

export default Modal;