import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField, Paper, Button } from "@material-ui/core";
import { useGame } from "../context/game";

const useStyles = makeStyles({
    root: {
        backgroundColor: "rgb(43, 86, 163)"
    },
    workingOut: {
        width: 500,
    },
});

export const Letters = () => {
    const classes = useStyles();
    const game = useGame();
    const [answer, setAnswer] = useState("");
    const [currentScore, setScore] = useState(0);
    const [seconds, setSeconds] = useState(game?.state.time === undefined ? 30 : parseInt(game.state.time));

    const handleCheckAnswer = () => {
        let answerSafe = false;
        if (game?.state.solutions != null || game?.state.solutions != undefined) {
            answerSafe = game?.state.solutions.includes(answer.toLowerCase()) && /[^a-zA-Z]/.test(answer);
        }
        setScore((answerSafe) ? answer.length : 0);
    };

    const handleAnswerChange = (event: any) => {
        setAnswer(event.target.value);
        console.log(event.target.value);
    };

    useEffect(() => {
        if (seconds > 0) {
            setTimeout(() => setSeconds(seconds - 1), 1000);
        } else {
            alert("time done");
        }
    });

    return (
        <Box className={classes.root}>
            <Paper>
                <TextField
                    id="outlined-multiline-static"
                    multiline
                    rows={3}
                    value={answer}
                    variant="outlined"
                    onChange={handleAnswerChange}
                />
                <Button variant="contained" onClick={handleCheckAnswer}>
                    Check answer
                </Button>
                <p>Mode: {game?.state.gameMode}</p>
                <p>Selection: {game?.state.selection} </p>
                <p>Points Scored: {currentScore} </p>
                <p>Seconds left: {seconds} </p>
                {seconds === 0 && <p>Solutions: {game?.state.solutions?.join(" ")}</p>}
                <Box></Box>
            </Paper>
        </Box>
    );
};
