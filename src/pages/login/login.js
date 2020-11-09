import React, { useState, useEffect } from "react";
import * as actionTypes from "../../store/actions/actionsIndex";
import { connect } from "react-redux";

import api from "../../services/api";
import facebookApi from "../../services/facebookApi";

import "../../components/DevForm/styles.scss";
import Spinner from "react-bootstrap/Spinner";
import classes from "./style.module.scss";
import gitLogo from "../../assets/gitlogo.png";
import PassRecovery from "./PassRecovery";
// import facebookFavicon from "../../assets/facebook.png";

export function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passRecovery, setPassRecovery] = useState("");
  const [messageToUser, setMessageToUser] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessageToUser("");
    }, 4000);
    return () => {
      clearTimeout(timer);
    };
  }, [messageToUser]);

  async function loginHandler(e) {
    e.preventDefault();
    setMessageToUser(
      <div className={classes.spinerContainer}>
        <Spinner animation="border" role="status" variant="info" />
      </div>
    );
    // LOGIN:
    await api
      .post("/login", {
        email,
        password,
      })
      .then((res) => {
        // console.log(res.data);
        props.onLogIn(res.data.email, res.data.id, res.data.token);
      })
      .catch((err) => {
        if (err.response) {
          // Client received an error response (5xx, 4xx):
          setMessageToUser(err.response.data.message);
          // MESSAGE COMING FROM BACKEND: Email not registered!
        } else if (err.request) {
          // Client never received a response, or request never left:
          setMessageToUser("Connection unavailable at the moment!");
        } else {
          // Anything else:
          setMessageToUser("Connection unavailable at the moment!");
        }
      });
  }

  function loginWithFacebook(e) {
    e.preventDefault();
    setMessageToUser(
      <div className={classes.spinerContainer}>
        <Spinner animation="border" role="status" variant="info" />
      </div>
    );
    // services/facebookApi.js:
    window.location.href = facebookApi;
  }

  function cancelPassRecoveryHandler() {
    setPassRecovery("");
  }
  function passRecoverySucceed() {
    setMessageToUser("Please check your email for the password!");
  }

  function forgotPasswordClickHandler(e) {
    e.preventDefault();
    setPassRecovery(
      <PassRecovery
        cancelPassRecoveryHandler={cancelPassRecoveryHandler}
        passRecoverySucceed={passRecoverySucceed}
      />
    );
  }
  return (
    <>
      {passRecovery}
      <div className={classes.container}>
        <aside className={classes.formBox}>
          <strong>My Favorite GitHub Developers</strong>
          <form onSubmit={loginHandler}>
            <div className="input-block">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-block">
              <label htmlFor="techs">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                minlength="3"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={classes.btnsGrid}>
              <button
                onClick={loginWithFacebook}
                className={classes.facebookBtn}
              >
                {/* <img className={classes.facebookImg} src={facebookFavicon} /> */}
                <h3 className={classes.btnText}>Log in with Facebook</h3>
              </button>
              <button type="submit" className={classes.btnLogin}>
                <h3 className={classes.btnText}>LOG IN</h3>
              </button>
            </div>
          </form>
          Don't have an account?{" "}
          <span
            className={classes.logSignClick}
            onClick={props.toogleComponent}
          >
            Sign up
          </span>
          <br />
          <span
            className={classes.forgotPassClick}
            onClick={forgotPasswordClickHandler}
          >
            <i>Forgot your password?</i>
          </span>
          <h2 className="errorMessage">{messageToUser}</h2>
        </aside>
        <div className={classes.imgBox}>
          <img className={classes.gitLogoImg} src={gitLogo} alt="" />
        </div>
      </div>
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogIn: (email, id, token) =>
      dispatch(actionTypes.login(email, id, token)),
  };
};
export default connect(null, mapDispatchToProps)(Login);
