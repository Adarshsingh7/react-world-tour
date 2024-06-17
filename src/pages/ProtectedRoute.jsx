/** @format */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
	const { isLoggedIn } = useAuth();
	const navigate = useNavigate();
	useEffect(
		function () {
			if (!isLoggedIn) navigate('/');
		},
		[isLoggedIn, navigate]
	);

	if (!isLoggedIn) return null;
	return children;
}

export default ProtectedRoute;
