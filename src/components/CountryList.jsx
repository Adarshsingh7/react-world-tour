/** @format */

import styles from './CountryList.module.css';
import Spinner from './Spinner';
import CountryItem from './CountryItem';
import Message from './Message';
import { useCities } from '../context/CitiesContext';

function CountryList() {
	const { isLoading, cities } = useCities();
	if (isLoading) return <Spinner />;
	if (!cities.length)
		return <Message message={'add your first city by clicking on the map'} />;
	const country = cities.reduce((acc, curr) => {
		if (!acc.map((el) => el.country).includes(curr.country))
			return [
				...acc,
				{ country: curr.country, id: curr.id, emoji: curr.emoji },
			];
		else return acc;
	}, []);
	return (
		<ul className={styles.countryList}>
			{country.map((country) => (
				<CountryItem
					country={country}
					key={country.id}
				/>
			))}
		</ul>
	);
}

export default CountryList;
