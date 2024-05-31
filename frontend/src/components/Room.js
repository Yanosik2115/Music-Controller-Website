import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default function Room({ leaveRoomCallback }) {
	const { roomCode } = useParams();
	const [state, setState] = useState({
		votesToSkip: 2,
		guestCanPause: false,
		isHost: false,
		showSettings: false,
		spotifyAuthenticated: false,
		interval: null,
		song: {},
	});
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	useEffect(() => {
		getRoomDetails();
		getCurrentSong();
		componentDidMount();
	}, []);

	useEffect(() => {
		if (state.isHost) {
			authenticateSpotify();
		}
	}, [state.isHost]);

	const getCurrentSong = () => {
		fetch("/spotify/current-song")
			.then((response) => {
				if (!response.ok) {
					return {};
				} else {
					console.log(response);
					return response.json();
				}
			})
			.then((data) => {
				setState((prevState) => ({ ...prevState, song: data }));
			});
	};

	const authenticateSpotify = () => {
		fetch("/spotify/is-authenticated")
			.then((response) => response.json())
			.then((data) => {
				setState((prevState) => ({
					...prevState,
					spotifyAuthenticated: data.status,
				}));
				if (!data.status) {
					fetch("/spotify/get-auth-url")
						.then((response) => response.json())
						.then((data) => {
							window.location.replace(data.url);
						});
				}
			});
	};

	const getRoomDetails = async () => {
		await fetch("/api/get-room" + "?code=" + roomCode)
			.then((response) => {
				if (!response.ok) {
					leaveRoomCallback();
					navigate("/");
				}
				return response.json();
			})
			.then((data) => {
				console.log("COS");
				setState((prevState) => ({
					votesToSkip: data.votes_to_skip,
					guestCanPause: data.guest_can_pause,
					isHost: data.is_host,
					showSettings: prevState.showSettings,
				}));

				setIsLoading(false);
			});
	};

	const componentDidMount = () => {
		const interval = setInterval(getCurrentSong, 1000);
		setState((prevState) => ({
			...prevState,
			interval: interval,
		}));
	};

	const componentWillUnmount = () => {
		clearInterval(state.interval);
	};

	const leaveButtonPressed = () => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		};

		fetch("/api/leave-room", requestOptions).then((_response) => {
			leaveRoomCallback();
			navigate("/");
			componentWillUnmount();
		});
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const updateShowSettings = (value) => {
		setState((prevState) => ({
			...prevState,
			showSettings: value,
		}));
	};

	const renderSettings = () => {
		return (
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<CreateRoomPage
						update={true}
						votesToSkip={state.votesToSkip}
						guestCanPause={state.guestCanPause}
						roomCode={roomCode}
						updateCallback={getRoomDetails}
					/>
				</Grid>
				<Grid item xs={12} align="center">
					<Button
						variant="contained"
						color="secondary"
						onClick={() => updateShowSettings(false)}
					>
						Close
					</Button>
				</Grid>
			</Grid>
		);
	};

	const renderSettingsButton = () => {
		return (
			<Grid item xs={12} align="center">
				<Button
					variant="contained"
					color="primary"
					onClick={() => updateShowSettings(true)}
				>
					Settings
				</Button>
			</Grid>
		);
	};

	if (state.showSettings) {
		return renderSettings();
	}

	return (
		<Grid container spacing={1}>
			<Grid item xs={12} align="center">
				<Typography variant="h4" compact="h4">
					Code: {roomCode}
				</Typography>
			</Grid>
			<MusicPlayer {...state.song} />
			{state.isHost ? renderSettingsButton() : null}
			<Grid item xs={12} align="center">
				<Button
					color="secondary"
					variant="contained"
					onClick={leaveButtonPressed}
				>
					Leave Room
				</Button>
			</Grid>
		</Grid>
	);
}
