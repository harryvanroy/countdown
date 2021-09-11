import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles({
  root: {
    minWidth: "100%",
    display: "flex",
    backgroundColor: "#5096bb",
    // alignItems: "center",
    justifyContent: "center",
  },
  workingOut: {
    width: 500,
  },
  imagesty: {
    width: "100%",
    height: "100%",
  },
  submit: {
    display: "flex",
    flexDirection: "column",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  textfield: {
    backgroundColor: "#ffffff",
    padding: 25,
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
});

export function SimpleCard() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root}>
      <CardContent>
        <img
          src="./static/countdown.png"
          alt="logo"
          className={classes.imagesty}
        />
      </CardContent>
    </Card>
  );
}

export default function MultilineTextFields() {
  const classes = useStyles();
  const [value, setValue] = React.useState("Controlled");
  let content: string = "";

  const handleSubmit = (event: any) => {
    // Send the content off to the server and check if the user got the correct answer
  };

  const handleChange = (event: any) => {
    content = event.target.value;
  };

  return (
    <Card className={classes.root}>
      <form
        className={classes.textfield}
        noValidate
        autoComplete="on"
        onSubmit={handleSubmit}>
        <div>
          <TextField
            className={classes.workingOut}
            id="outlined-multiline-static"
            label="Working Out"
            multiline
            rows={16}
            defaultValue=""
            variant="outlined"
          />
        </div>
        <div className={classes.submit}>
          <TextField
            id="outlined-multiline-static"
            label="Solution"
            multiline
            rows={3}
            defaultValue=""
            variant="outlined"
            onChange={handleChange}
          />
          <input type="submit" value="Submit" />
        </div>
      </form>
    </Card>
  );
}
