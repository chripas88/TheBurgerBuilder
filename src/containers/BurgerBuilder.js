import React from 'react';
import Auxiliary from '../hoc/Auxiliary';
import Burger from '../components/burger/Burger';
import OrderSummary from '../components/burger/OrderSummary';
import BuildControls from '../components/burger/BuildControls';
import Modal from '../components/ui/Modal';
import axios from '../axios/axios-orders';
import Spinner from '../components/ui/Spinner';
import withErrorHandler from '../hoc/withErrorHandler';

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}

class BurgerBuilder extends React.Component{
	state = {
		ingredients: null,
		totalPrice: 4,
		purchasable: false,
		purchasing: false,
		loading: false,
		error: false
	}

	componentDidMount() {
		axios.get('https://the-burger-builder-ce48e.firebaseio.com/ingredients.json')
			.then(response => {
				this.setState({ingredients: response.data});
			})
			.catch(error => {
				this.setState({error: true});
			});
	}

	updatePurchaseState (ingredients) {	
		const sum = Object.keys(ingredients).map(igKey => {
			return ingredients[igKey]; 
		}).reduce((sum, el) => {
			return sum + el;
		}, 0);
		
		this.setState({purchasable: sum > 0});
	}

	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		const updatedCount = oldCount + 1;
		const updatedIngredients = {...this.state.ingredients};
		updatedIngredients[type] = updatedCount;
		const priceAddition = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice + priceAddition;
		this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
		this.updatePurchaseState(updatedIngredients);
	}
	
	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		if(oldCount <= 0) return;
		const updatedCount = oldCount - 1;
		const updatedIngredients = {...this.state.ingredients};
		updatedIngredients[type] = updatedCount;
		const priceDeduction = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice - priceDeduction;
		this.setState({ingredients: updatedIngredients, totalPrice: newPrice});
		this.updatePurchaseState(updatedIngredients);
	}
	
	purchaseHandler = () => {
		this.setState({purchasing: true});
	}
	
	purchaseCancelHandler = () => {
		this.setState({purchasing: false});
	}
	
	purchaseContinueHandler = () => {		
		const queryParams = [];
		for(let i in this.state.ingredients){
			queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]))
		}
		queryParams.push('price=' + this.state.totalPrice);
		const queryString = queryParams.join('&');
		this.props.history.push({
			pathname: '/checkout',
			search: '?' + queryString
		});
	}
	
	render(){
		const disabledInfo = {...this.state.ingredients};
		
		for(let key in disabledInfo){
			disabledInfo[key] = disabledInfo[key] <=0;
		}
		
		let orderSummary = null;	
		let burger = this.state.error ? <p>Cannot load ingredients. Please reload page!</p> : <Spinner />;
		
		if(this.state.ingredients){
			burger =(
				<Auxiliary>
					<Burger ingredients={this.state.ingredients}/>
					<BuildControls
						disabled={disabledInfo}
						totalPrice={this.state.totalPrice}
						ingredientAdded={this.addIngredientHandler}
						ingredientRemoved={this.removeIngredientHandler}
						purchasable={this.state.purchasable}
						ordered={this.purchaseHandler}/>
				</Auxiliary>
			);
			
			orderSummary = <OrderSummary
				ingredients={this.state.ingredients}
				totalPrice={this.state.totalPrice}
				purchaseCancelled={this.purchaseCancelHandler}
				purchaseContinued={this.purchaseContinueHandler}/>;
		}
		
		if(this.state.loading){
			orderSummary = <Spinner />;
		}
		
		return(
			<Auxiliary>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
					{burger}
			</Auxiliary>
		);
	}
}

export default withErrorHandler(BurgerBuilder, axios);