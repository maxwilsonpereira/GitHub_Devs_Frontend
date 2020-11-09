import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

// React Router DOM: (helps to router URLs to components).
// npm install react-router-dom
import { BrowserRouter, Switch, Route } from "react-router-dom";
// USE SWITH with the "/" on the bottom! Like above:

import "./global.css";
import "./App.css";
import "./Main.css";

import LoginPage from "./pages/login";
import DevelopersPage from "./pages/developers";
import Footer from "./components/Footer";
import FacebookApiLogin from "./components/FacebookApiLogin";

function App(props) {
  const [content, setContent] = useState();

  useEffect(() => {
    props.isLogged === "true"
      ? setContent(
          <div id="footerOnBottom">
            <div id="footerOnBottomWrap">
              <DevelopersPage />
            </div>
            <Footer />
          </div>
        )
      : setContent(<LoginPage />);
  }, [props.isLogged]);

  return (
    <BrowserRouter>
      <Switch>
        <Route
          path={"/githubdevs/facebookapilogin"}
          component={FacebookApiLogin}
        />
        <Route path="/">
          <>{content}</>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

const mapStateToProps = (state) => {
  return {
    isLogged: state.global.isLogged,
  };
};

export default connect(mapStateToProps)(App);
