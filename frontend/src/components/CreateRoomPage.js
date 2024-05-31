import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useNavigate } from "react-router-dom";
import { Collapse } from "@material-ui/core";
import { useEffect } from "react";
import Alert from "@material-ui/lab/Alert";

const DEFAULT_VOTES_TO_SKIP = 2;
const DEFAULT_GUEST_CAN_PAUSE = false;

export default function CreateRoomPage({
	votesToSkip = DEFAULT_VOTES_TO_SKIP,
	guestCanPause = DEFAULT_GUEST_CAN_PAUSE,
	update = false,
	roomCode = null,
	updateCallback = () => {},
}) {
	const defaultVotes = 2;

	const [state, setState] = useState({
		guestCanPause: guestCanPause,
		votesToSkip: votesToSkip,
		errorMsg: "",
		successMsg: "",
	});

	useEffect(() => {
		if (state.successMsg === "Room updated successfully!") {
			updateCallback();
		}
	}, [state.successMsg]);

	const navigate = useNavigate();

	const handleVotesChange = (e) => {
		setState((prevState) => ({
			...prevState,
			votesToSkip: e.target.value,
		}));
	};

	const handleGuestCanPauseChange = (e) => {
		setState((prevState) => ({
			...prevState,
			guestCanPause: e.target.value === "true",
		}));
	};

	const handleRoomButtonPressed = () => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				votes_to_skip: state.votesToSkip,
				guest_can_pause: state.guestCanPause,
			}),
		};
		fetch("/api/create-room", requestOptions)
			.then((response) => response.json())
			.then((data) => {
				navigate("/room/" + data.code);
			});
	};

	const handleUpdateButtonPressed = () => {
		const requestOptions = {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				votes_to_skip: state.votesToSkip,
				guest_can_pause: state.guestCanPause,
				code: roomCode,
			}),
		};
		fetch("/api/update-room", requestOptions).then((response) => {
			if (response.ok) {
				setState({
					successMsg: "Room updated successfully!",
				});
			} else {
				setState({
					errorMsg: "Error updating room...",
				});
			}
		});
	};

	const renderCreateButtons = () => {
		return (
			<Grid container spacing={1}>
				<Grid item xs={12} align="center">
					<Button
						color="primary"
						variant="contained"
						onClick={handleRoomButtonPressed}
					>
						Create a room
					</Button>
				</Grid>
				<Grid item xs={12} align="center">
					<Button
						color="secondary"
						variant="contained"
						to="/"
						component={Link}
					>
						Back
					</Button>
				</Grid>
			</Grid>
		);
	};

	const renderUpdateButtons = () => {
		return (
			<Grid item xs={12} align="center">
				<Button
					color="primary"
					variant="contained"
					onClick={handleUpdateButtonPressed}
				>
					Update Room
				</Button>
			</Grid>
		);
	};

	const title = update ? "Update Room" : "Create a Room";

	return (
		<Grid container spacing={1}>
			<Grid item xs={12} align="center">
				<Collapse in={state.errorMsg != "" || state.successMsg != ""}>
					{state.successMsg != "" ? (
						<Alert
							severity="success"
							onClose={() => {
								setState({
									successMsg: "",
								});
							}}
						>
							{state.successMsg}
						</Alert>
					) : (
						<Alert severity="error">
							{state.errorMsg} onClose=
							{() => {
								setState({
									errorMsg: "",
								});
							}}
						</Alert>
					)}
				</Collapse>
			</Grid>
			<Grid item xs={12} align="center">
				<Typography component="h4" variant="h4">
					{title}
				</Typography>
			</Grid>
			<Grid item xs={12} align="center">
				<FormControl component="fieldset">
					<FormHelperText>
						<div align="center">
							Guest Control of Playback state
						</div>
					</FormHelperText>
					<RadioGroup
						row
						defaultValue={guestCanPause.toString()}
						onChange={handleGuestCanPauseChange}
					>
						<FormControlLabel
							value="true"
							control={<Radio color="primary"></Radio>}
							label="Play/Pause"
							labelPlacement="bottom"
						></FormControlLabel>
						<FormControlLabel
							value="false"
							control={<Radio color="secondary"></Radio>}
							label="No control"
							labelPlacement="bottom"
						></FormControlLabel>
					</RadioGroup>
				</FormControl>
			</Grid>
			<Grid item xs={12} align="center">
				<FormControl>
					<TextField
						required="true"
						type="number"
						defaultValue={state.votesToSkip}
						inputProps={{
							min: 1,
							style: { textAlign: "center" },
						}}
						onChange={handleVotesChange}
					></TextField>
					<FormHelperText>
						<div align="center">Votes required to skip song</div>
					</FormHelperText>
				</FormControl>
			</Grid>
			{update ? renderUpdateButtons() : renderCreateButtons()}
		</Grid>
	);
}
