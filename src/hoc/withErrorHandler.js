import React from 'react';
import Modal from '../components/ui/Modal';
import Auxiliary from './Auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {
	return class extends React.Component {
		constructor(props){
			super();
			
			this.requestInterceptor = axios.interceptors.request.use(request =>{
				this.setState({error: null});
				return request;
			});
			
			this.responseInterceptor = axios.interceptors.response.use(response => response, error => {
				this.setState({error: error});
			});
		}
		
		state = {
			error: null
		}
		
		// componentDidMount(){
		// 	axios.interceptors.request.use(request =>{
		// 		this.setState({error: null});
		// 		return request;
		// 	});
		// 	axios.interceptors.response.use(response => response, error => {
		// 		this.setState({error: error});
		// 	});
		// }
	
		componentWillUnmount(){
			axios.interceptors.request.eject(this.requestInterceptor);
			axios.interceptors.response.eject(this.responseInterceptor);
		}
		
		errorConfirmedHandler = () => {
			this.setState({error: null});
		}
		
		render(){
			return(
				<Auxiliary>
					<Modal show={this.state.error} modalClosed={this.errorConfirmedHandler}>
						{this.state.error ? this.state.error.message : null}
					</Modal>
					<WrappedComponent {...this.props} />
				</Auxiliary>
			);
		}
	}
}

export default withErrorHandler;