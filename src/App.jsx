/** @format */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Product from './pages/Product.jsx';
import Pricing from './pages/Pricing.jsx';
import Homepage from './pages/Homepage.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import AppLayout from './pages/AppLayout.jsx';
import Login from './pages/Login.jsx';
import CityList from './components/CityList.jsx';
import CountryList from './components/CountryList.jsx';
import City from './components/City.jsx';
import Form from './components/Form.jsx';
import { CityProvider } from './context/CitiesContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
	return (
		<AuthProvider>
			<CityProvider>
				<BrowserRouter>
					<Routes>
						<Route
							path='product'
							element={<Product />}
						/>
						<Route
							path='pricing'
							element={<Pricing />}
						/>
						<Route
							path='/'
							element={<Homepage />}
						/>
						<Route
							path='/app'
							element={<AppLayout />}
						>
							<Route
								index
								element={<CityList />}
							/>
							<Route
								path='cities'
								element={<CityList />}
							/>
							<Route
								path='cities/:id'
								element={<City />}
							/>
							<Route
								path='countries'
								element={<CountryList />}
							/>
							<Route
								path='form'
								element={<Form />}
							/>
						</Route>
						<Route
							path='/login'
							element={<Login />}
						/>
						<Route
							path='*'
							element={<PageNotFound />}
						/>
					</Routes>
				</BrowserRouter>
			</CityProvider>
		</AuthProvider>
	);
}

export default App;
