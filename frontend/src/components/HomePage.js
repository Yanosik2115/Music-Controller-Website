import React, { useState, useEffect } from "react";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import { useNavigate, Navigate } from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function HomePage() {
	const [state, setState] = useState({
		roomCode: null,
	});

	const clearRoomCode = () => {
		setState({
			roomCode: null,
		});
	};

	useEffect(() => {
		async function fetchAPI() {
			fetch("/api/user-in-room")
				.then((response) => response.json())
				.then((data) => {
					if (data.code) {
						setState({
							roomCode: data.code,
						});
					}
				});
		}
		fetchAPI();
	}, []);

	const renderHomePage = () => {
		if (state.roomCode) {
			return <Navigate to={`/room/${state.roomCode}`} replace={true} />;
		} else {
			return (
				<Grid container spacing={3}>
					<Grid item xs={12} align="center">
						<Typography variant="h3" compact="h3">
							House Party
						</Typography>
					</Grid>
					<Grid item xs={12} align="center">
						<ButtonGroup
							disableElevation
							variant="contained"
							color="primary"
						>
							<Button color="primary" to="/join" component={Link}>
								Join a Room
							</Button>
							<Button
								color="secondary"
								to="/create"
								component={Link}
							>
								Create a Room
							</Button>
						</ButtonGroup>
					</Grid>
				</Grid>
			);
		}
	};
	return (
		<Router>
			<Routes>
				<Route path="/" element={renderHomePage()} />
				<Route path="/join" element={<RoomJoinPage />} />
				<Route path="/create" element={<CreateRoomPage />} />
				<Route
					path="/room/:roomCode"
					element={
						<Room
							leaveRoomCallback={() => {
								clearRoomCode();
							}}
						/>
					}
				/>
			</Routes>
		</Router>
	);
}
