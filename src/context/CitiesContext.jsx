/** @format */

import { createContext, useState, useEffect, useContext } from 'react';

const BASE_URL = 'http://localhost:8000';

const CitiesContext = createContext();

const CityProvider = function ({ children }) {
	const [cities, setCities] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentCity, setCurrentCity] = useState({});

	useState(function () {
		async function fetchCities() {
			setIsLoading(true);
			try {
				const res = await fetch(BASE_URL + '/cities');
				const data = await res.json();
				setCities(data);
			} catch (err) {
				console.log(`error while fetching the data`);
			} finally {
				setIsLoading(false);
			}
		}
		fetchCities();
	}, []);

	async function getCity(id) {
		try {
			setIsLoading(true);
			const res = await fetch(BASE_URL + '/cities/' + id);
			const data = await res.json();
			setCurrentCity(data);
		} catch (err) {
			console.log(`error while fetching the data`);
		} finally {
			setIsLoading(false);
		}
	}

	async function createCity(newCity) {
		try {
			setIsLoading(true);
			const res = await fetch(BASE_URL + '/cities/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newCity),
			});
			const data = await res.json();
			setCities([...cities, data]);
		} catch (err) {
			console.log(`error while creating the data`);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<CitiesContext.Provider
			value={{ cities, isLoading, currentCity, getCity, createCity }}
		>
			{children}
		</CitiesContext.Provider>
	);
};

const useCities = function () {
	const context = useContext(CitiesContext);
	if (context === undefined)
		throw new Error('citycontext was used outside the scope');
	return context;
};

export { CityProvider, useCities };
