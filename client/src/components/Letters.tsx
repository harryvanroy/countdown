import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField, Paper, Button } from "@material-ui/core";
import { useGame } from "../context/game";

const useStyles = makeStyles({
    root: {
        backgroundColor: "rgb(43, 86, 163)",
        height: "100vh",
    },
    workingOut: {
        width: 500,
    },
});

export const Letters = () => {
    const [answer, setAnswer] = useState("");
    const [currentTotal, setTotal] = useState(0);
    const [seconds, setSeconds] = useState(60);

    const classes = useStyles();
    const game = useGame();

    const handleCheckAnswer = () => {
        const answerSafe = answer.replace(/[^-()\d/*+.]/g, "");
        console.log(answerSafe);
        setTotal(eval(answerSafe));
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
                <p>Solutions: {game?.state.solutions?.join(" ")}</p>
                <p>Selection: {game?.state.selection} </p>
                <p>Seconds left: {seconds} </p>
                <Box></Box>
            </Paper>
        </Box>
    );
};
