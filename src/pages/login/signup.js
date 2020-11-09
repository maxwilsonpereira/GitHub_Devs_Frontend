import React, { useState, useEffect } from "react";
import * as actionTypes from "../../store/actions/actionsIndex";
import { connect } from "react-redux";

import api from "../../../src/services/api";

import "../../components/DevForm/styles.scss";
import Spinner from "react-bootstrap/Spinner";
import classes from "./style.module.scss";
import gitLogo from "../../assets/gitlogo.png";

export function Signup(props) {
  // const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [messageToUser, setMessageToUser] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessageToUser("");
    }, 4000);
    return () => {
      clearTimeout(timer);
    };
  }, [messageToUser]);

  function setCoordinates(e) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log(position);
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
      },
      (err) => {
        console.log(err);
        alert(
          "You must allow Location Access on your browser (Address bar right corner)"
        );
      },
      {
        timeout: 30000,
      }
    );
  }

  async function signUpUserHandler(e) {
    e.preventDefault();
    setMessageToUser(
      <div className={classes.spinerContainer}>
        <Spinner animation="border" role="status" variant="info" />
      </div>
    );
    if (password != passwordConfirm) {
      setMessageToUser("Passwords don't match!");
    } else if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setMessageToUser("Wrong coordinates!");
    } else {
      // POST to create a new user
      await api
        .post("/users", {
          email,
          password,
          latitude,
          longitude,
        })
        .then((res) => {
          // MESSAGE FROM BACKEND:
          // "User created! Logging in..."
          setMessageToUser(res.data.message);
          // console.log(res.data.newUser);
          api
            .post("/login", {
              email,
              password,
            })
            .then((res) => {
              // console.log(res.data);
              props.onLogIn(res.data.email, res.data.id, res.data.token);
            });
        })
        .catch((err) => {
          if (err.response) {
            // Client received an error response (5xx, 4xx):
            setMessageToUser(err.response.data.message);
            // MESSAGE COMING FROM BACKEND: Email already registered!
          } else if (err.request) {
            // Client never received a response, or request never left:
            setMessageToUser("Connection unavailable at the moment!");
          } else {
            // Anything else:
            setMessageToUser("Connection unavailable at the moment!");
          }
        });
    }
  }
  return (
    <div className={classes.container}>
      <aside className={classes.formBox}>
        <strong>Create Your Account</strong>
        <form onSubmit={signUpUserHandler}>
          <div className="input-block">
            <label htmlFor="techs">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <div className="input-block">
              <label htmlFor="techs">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                minlength="3"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-block">
              <label htmlFor="techs">Password (confirm)</label>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                minlength="3"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          </div>
          <div className="input-group">
            <div className="input-block">
              <label htmlFor="latitude">Latitude (optional)</label>
              <input
                type="number"
                name="Latitude"
                id="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
            <div className="input-block">
              <label htmlFor="longitude">Longitude (optional)</label>
              <input
                type="number"
                name="Longiture"
                id="Longiture"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </div>

          <div className={classes.btnsGrid}>
            <button onClick={setCoordinates} className={classes.btnCoordinates}>
              {/* <img className={classes.facebookImg} src={facebookFavicon} /> */}
              <h3 className={classes.btnText}>Set Coordinates (optional)</h3>
            </button>
            <button type="submit" className={classes.btnSignup}>
              <h3 className={classes.btnText}>SIGN UP</h3>
            </button>
          </div>
        </form>
        Have an account?{" "}
        <span className={classes.logSignClick} onClick={props.toogleComponent}>
          Log in
        </span>
        <h2 className="errorMessage">{messageToUser}</h2>
      </aside>
      <div className={classes.imgBox}>
        <img className={classes.gitLogoSignupImg} src={gitLogo} alt="" />
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogIn: (email, id, token) =>
      dispatch(actionTypes.login(email, id, token)),
  };
};
export default connect(null, mapDispatchToProps)(Signup);
