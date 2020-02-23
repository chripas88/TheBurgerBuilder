import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Layout from '../containers/Layout';
import BurgerBuilder from '../containers/BurgerBuilder';
import Orders from '../containers/Orders';
import Checkout from '../containers/Checkout';

class App extends React.Component{
	render(){
		return(
			<div>
				<Layout>
					<Switch>
						<Route path="/checkout" component={Checkout} />
						<Route path="/orders" component={Orders} />
						<Route path="/" component={BurgerBuilder} />
					</Switch>
				</Layout>
			</div>
		);
	}
}

export default App;