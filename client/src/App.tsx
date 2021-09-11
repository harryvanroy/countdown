import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./Home";
import { Numbers, SimpleCard } from "./numbers";
import Lobby, { LobbyProps } from "./Lobby";
import GameRoom from "./GameRoom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/numbersgame" exact>
          <Numbers />
          <SimpleCard />
        </Route>
        <Route
          path="/:roomId"
          render={(props) => <Lobby roomId={props.match.params.roomId} />}
        />
        <Route path="/" exact>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
