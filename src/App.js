import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.scss";

import GameLobby from "./pages/GameLobby/GameLobby";
import GameRoom from "./pages/GameRoom/GameRoom";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={GameLobby} />
        <Route path="/room/:id" component={GameRoom} />
        <Route path="/" component={PageNotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
