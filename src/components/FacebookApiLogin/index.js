import React, { useEffect } from "react";
import * as actionTypes from "../../store/actions/actionsIndex";
import { connect } from "react-redux";

import api from "../../../src/services/api";
// REDIRECT
// npm install react-router-dom
import { useHistory } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import classes from "./style.module.css";

export function FacebookApiLogin(props) {
  let history = useHistory();
  // const prodId = req.params.productId;
  useEffect(() => {
    let params = new URL(document.location).searchParams;
    let email = params.get("email");
    let password = params.get("password");

    // console.log("Email: ", email);
    // console.log("Password: ", password);
    // LOGIN:
    api
      .post("/login", {
        email,
        password,
      })
      .then((res) => {
        // console.log("*** RESPONSE.DATA: ", res.data);
        props.onLogIn(res.data.email, res.data.id, res.data.token);
        history.push("/");
      })
      .catch((err) => {
        history.push("/");
        if (err.response) {
          // Client received an error response (5xx, 4xx):
          console.log(err.response.data.message);
          // MESSAGE COMING FROM BACKEND: Email not registered!
        } else if (err.request) {
          // Client never received a response, or request never left:
          console.log("Connection unavailable at the moment!");
        } else {
          // Anything else:
          console.log("Connection unavailable at the moment!");
        }
      });
  }, []);

  return (
    <div className={classes.container}>
      <h1 className={classes.text}>Connecting</h1>
      <Spinner animation="border" role="status" variant="info" />
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogIn: (email, id, token) =>
      dispatch(actionTypes.login(email, id, token)),
  };
};
export default connect(null, mapDispatchToProps)(FacebookApiLogin);
