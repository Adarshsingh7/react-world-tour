/** @format */

// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

import { useEffect, useState } from 'react';

import Button from './Button';
import styles from './Form.module.css';
import BackButton from './BackButton';
import { useUrlPosition } from '../hooks/useUrlPosition';
import Message from './Message';
import Spinner from './Spinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCities } from '../context/CitiesContext';
import { useNavigate } from 'react-router-dom';

export function convertToEmoji(countryCode) {
	const codePoints = countryCode
		.toUpperCase()
		.split('')
		.map((char) => 127397 + char.charCodeAt());
	return String.fromCodePoint(...codePoints);
}

function Form() {
	const [cityName, setCityName] = useState('');
	const [country, setCountry] = useState('');
	const [date, setDate] = useState(new Date());
	const [notes, setNotes] = useState('');
	const [lat, lng] = useUrlPosition();
	const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
	const [emoji, setEmoji] = useState('');
	const [getCodingError, setGeocodingError] = useState(null);
	const { createCity, isLoading } = useCities();
	const navigate = useNavigate();

	useEffect(
		function () {
			if (!lat && !lng) return;
			async function fetchData() {
				try {
					setGeocodingError(null);
					setIsLoadingGeocoding(true);
					const url = `${BASE_URL}?latitude=${lat}&longitude=${lng}`;
					const response = await fetch(url);
					const data = await response.json();

					if (!data.countryCode) {
						throw new Error(
							'No country code found! try clicking valid location on the map.😽'
						);
					}

					setCityName(data.city || data.locality || '');
					setCountry(data.countryName || '');
					setEmoji(convertToEmoji(data.countryCode));
				} catch (err) {
					console.log(err.message);
					setGeocodingError(err.message);
				} finally {
					setIsLoadingGeocoding(false);
				}
			}
			fetchData();
		},
		[lat, lng]
	);

	async function handleSubmit(e) {
		e.preventDefault();
		if (!cityName || !country || !date) return;
		const newCity = {
			cityName,
			country,
			emoji,
			date,
			notes,
			position: { lat, lng },
		};
		await createCity(newCity);
		navigate('/app/cities');
	}

	if (getCodingError) return <Message message={getCodingError} />;
	if (!lat && !lng)
		return (
			<Message message='No location selected! Please select a location on the map.' />
		);
	if (isLoadingGeocoding) return <Spinner />;

	return (
		<form
			className={`${styles.form} ${isLoading ? styles.loading : ''}`}
			onSubmit={handleSubmit}
		>
			<div className={styles.row}>
				<label htmlFor='cityName'>City name</label>
				<input
					id='cityName'
					onChange={(e) => setCityName(e.target.value)}
					value={cityName}
				/>
				<span className={styles.flag}>{emoji}</span>
			</div>

			<div className={styles.row}>
				<label htmlFor='date'>When did you go to {cityName}?</label>
				{/* <input
					id='date'
					onChange={(e) => setDate(e.target.value)}
					value={date}
				/> */}

				<DatePicker
					onChange={(date) => setDate(date)}
					selected={date}
					dateFormat={'dd/MM/yyyy'}
					id='date'
				/>
			</div>

			<div className={styles.row}>
				<label htmlFor='notes'>Notes about your trip to {cityName}</label>
				<textarea
					id='notes'
					onChange={(e) => setNotes(e.target.value)}
					value={notes}
				/>
			</div>

			<div className={styles.buttons}>
				<Button type='primary'>Add</Button>
				<BackButton />
			</div>
		</form>
	);
}

export default Form;
