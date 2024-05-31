import React from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RoomJoinPage() {
	const [state, setState] = useState({
		roomCode: "",
		error: "",
	});
	const navigate = useNavigate();
	const handleTextFieldChange = (e) => {
		setState({
			roomCode: e.target.value,
		});
	};

	const roomButtonPressed = () => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				code: state.roomCode,
			}),
		};
		fetch("/api/join-room", requestOptions)
			.then((response) => {
				if (response.ok) {
					navigate(`/room/${state.roomCode}`);
				} else {
					setState({ error: "Room not found." });
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<Grid container spacing={1} align="center">
			<Grid item xs={12}>
				<Typography variant="h4" component="h4">
					Join a Room
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<TextField
					error={state.error}
					label="Code"
					placeholder="Enter a Room Code"
					value={state.roomCode}
					helperText={state.error}
					variant="outlined"
					onChange={handleTextFieldChange}
				></TextField>
			</Grid>
			<Grid item xs={12}>
				<Button
					variant="contained"
					color="primary"
					onClick={roomButtonPressed}
				>
					Enter Room
				</Button>
			</Grid>
			<Grid item xs={12}>
				<Button
					variant="contained"
					color="secondary"
					to="/"
					component={Link}
				>
					Back
				</Button>
			</Grid>
		</Grid>
	);
}
