import React from 'react';
import NavigationItem from './NavigationItem';
import classes from '../../stylesheets/components/navigation/NavigationItems.module.css';

const navigationItems = () => (
	<ul className={classes.NavigationItems}>
		<NavigationItem link="/">Burger Builder</NavigationItem>
		<NavigationItem link="/orders">Orders</NavigationItem>
	</ul>
);

export default navigationItems;