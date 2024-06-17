/** @format */

import Map from '../components/Map';
import Sidebar from '../components/Sidebar';
import User from '../components/User';

import { useAuth } from '../context/AuthContext';

import styles from './AppLayout.module.css';
import ProtectedRoute from './ProtectedRoute';

function AppLayout() {
	const { isLoggedIn } = useAuth();
	return (
		<ProtectedRoute>
			<div className={styles.app}>
				<Sidebar />
				<Map />
				<User />
			</div>
		</ProtectedRoute>
	);
}

export default AppLayout;
