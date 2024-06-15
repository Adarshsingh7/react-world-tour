/** @format */
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMap,
	useMapEvent,
} from 'react-leaflet';
import styles from './Map.module.css';
import { useEffect, useState } from 'react';
import { useCities } from '../context/CitiesContext';
import Button from './Button';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { useUrlPosition } from '../hooks/useUrlPosition.js';

function Map() {
	const navigate = useNavigate();
	const [mapPosition, setMapPosition] = useState([
		52.53586782505711, 13.376933665713324,
	]);
	const { cities } = useCities();
	const {
		isLoading: isLoadingPosition,
		position: geolocationPosition,
		getPosition,
	} = useGeolocation();
	const [mapLat, mapLng] = useUrlPosition();

	useEffect(() => {
		if (mapLat && mapLng) {
			setMapPosition([mapLat, mapLng]);
		}
	}, [mapLat, mapLng]);

	useEffect(() => {
		if (geolocationPosition) {
			setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
		}
	}, [geolocationPosition]);

	return (
		<div className={styles.mapContainer}>
			{!geolocationPosition && (
				<Button
					type='position'
					onClick={getPosition}
				>
					{isLoadingPosition ? 'loading...' : 'use your position'}
				</Button>
			)}
			<MapContainer
				className={styles.map}
				center={mapPosition}
				zoom={6}
				scrollWheelZoom={true}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
				/>
				{cities.map((city) => (
					<Marker
						key={city.id}
						position={[city.position.lat, city.position.lng]}
					>
						<Popup>
							<span>{city.emoji}</span>
							<span>{city.cityName}</span>
						</Popup>
					</Marker>
				))}
				<ChangeCenter position={mapPosition} />
				<DetectClick />
			</MapContainer>
		</div>
	);
}

function ChangeCenter({ position }) {
	const map = useMap();
	map.setView(position);
	return null;
}

function DetectClick() {
	const navigate = useNavigate();
	useMapEvent('click', (e) => {
		navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
	});
}

export default Map;
