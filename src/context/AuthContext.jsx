/** @format */

import { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext();

const INIT = {
	isLoggedIn: false,
	user: null,
};

function reducer(state, action) {
	switch (action.type) {
		case 'login':
			return { ...state, isLoggedIn: true, user: action.payload };
		case 'logout':
			return { INIT };
		default:
			throw new Error('invalid type');
	}
}

const FAKE_USER = {
	name: 'Jack',
	email: 'jack@example.com',
	password: 'qwerty',
	avatar: 'https://i.pravatar.cc/100?u=zz',
};

function AuthProvider({ children }) {
	const [{ user, isLoggedIn }, dispatcher] = useReducer(reducer, INIT);
	function login(email, password) {
		if (email === FAKE_USER.email && password === FAKE_USER.password) {
			dispatcher({ type: 'login', payload: FAKE_USER });
		}
	}
	function logout() {
		dispatcher({ type: 'logout' });
	}
	return (
		<AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error('context was used outside the provider');
	return context;
}

export { AuthProvider, useAuth };
