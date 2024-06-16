/** @format */

import {
	createContext,
	useState,
	useEffect,
	useContext,
	useReducer,
} from 'react';

const BASE_URL = 'http://localhost:8000';

const CitiesContext = createContext();

const initialState = {
	cities: [],
	isLoading: false,
	currentCity: {},
	error: '',
};

function reducer(state, action) {
	switch (action.type) {
		case 'loading':
			return { ...state, isLoading: true };
		case 'cities/loaded':
			return { ...state, isLoading: false, cities: action.payload };
		case 'city/loaded':
			return { ...state, isLoading: false, currentCity: action.payload };
		case 'city/created':
			return {
				...state,
				isLoading: false,
				cities: [...state.cities, action.payload],
				currentCity: action.payload,
			};

		case 'city/deleted':
			return {
				...state,
				isLoading: false,
				cities: state.cities.filter((city) => city.id !== action.payload),
				currentCity: {},
			};

		case 'rejected':
			return { ...state, isLoading: false, error: action.payload };

		default:
			throw new Error('unknown action type');
	}
}

const CityProvider = function ({ children }) {
	const [{ cities, isLoading, currentCity }, dispatcher] = useReducer(
		reducer,
		initialState
	);
	// const [cities, setCities] = useState([]);
	// const [isLoading, setIsLoading] = useState(false);
	// const [currentCity, setCurrentCity] = useState({});

	useEffect(function () {
		dispatcher({ type: 'loading' });
		async function fetchCities() {
			try {
				const res = await fetch(BASE_URL + '/cities');
				const data = await res.json();
				dispatcher({ type: 'cities/loaded', payload: data });
			} catch (err) {
				dispatcher({ type: 'rejected', payload: 'there was error in loading' });
			}
		}
		fetchCities();
	}, []);

	async function getCity(id) {
		if (+currentCity.id === +id) return;
		dispatcher({ type: 'loading' });
		try {
			const res = await fetch(BASE_URL + '/cities/' + id);
			const data = await res.json();
			dispatcher({ type: 'city/loaded', payload: data });
		} catch (err) {
			dispatcher({
				type: 'rejected',
				payload: `error while fetching the city`,
			});
		}
	}

	async function createCity(newCity) {
		dispatcher({ type: 'loading' });
		try {
			const res = await fetch(BASE_URL + '/cities/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newCity),
			});
			const data = await res.json();
			// setCities([...cities, data]);
			dispatcher({ type: 'city/created', payload: data });
		} catch (err) {
			dispatcher({
				type: 'rejected',
				payload: `error while creating the city`,
			});
		}
	}
	async function deleteCity(id) {
		dispatcher({ type: 'loading' });
		try {
			const res = await fetch(BASE_URL + '/cities/' + id, {
				method: 'DELETE',
			});
			const data = await res.json();
			// setCities(cities.filter((city) => city.id !== id));
			dispatcher({ type: 'city/deleted', payload: id });
		} catch (err) {
			console.log(`error while deleting the city`);
		} finally {
			dispatcher({
				type: 'rejected',
				payload: `error while delete the city`,
			});
		}
	}

	return (
		<CitiesContext.Provider
			value={{
				cities,
				isLoading,
				currentCity,
				getCity,
				createCity,
				deleteCity,
			}}
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
