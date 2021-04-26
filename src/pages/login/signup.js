import React, { useState, useEffect } from 'react';
import * as actionTypes from '../../store/actions/actionsIndex';
import { connect } from 'react-redux';

import api from '../../../src/services/api';

// npm i react-useanimations
// https://useanimations.github.io/react-useanimations/?path=/story/animations--all
import UseAnimations from 'react-useanimations';
import github from 'react-useanimations/lib/github';
import '../../components/DevForm/styles.scss';
import Spinner from 'react-bootstrap/Spinner';
import classes from './style.module.scss';
import gitLogo from '../../assets/gitlogo.png';

export function Signup(props) {
  // const [name, setName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [messageToUser, setMessageToUser] = useState('');
  const [spinner, setSpinner] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessageToUser('');
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
          'You must allow Location Access on your browser (Address bar right corner)'
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
      setSpinner('');
      setMessageToUser("Passwords don't match!");
    } else if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setSpinner('');
      setMessageToUser('Wrong coordinates!');
    } else {
      // POST to create a new user
      await api
        .post('/users', {
          email,
          password,
          latitude,
          longitude,
        })
        .then((res) => {
          setSpinner('');
          // MESSAGE FROM BACKEND:
          // "User created! Logging in..."
          setMessageToUser(res.data.message);
          // console.log(res.data.newUser);
          api
            .post('/login', {
              email,
              password,
            })
            .then((res) => {
              // console.log(res.data);
              props.onLogIn(res.data.email, res.data.id, res.data.token);
            });
        })
        .catch((err) => {
          setSpinner('');
          if (err.response) {
            // Client received an error response (5xx, 4xx):
            setMessageToUser(err.response.data.message);
            // MESSAGE COMING FROM BACKEND: Email already registered!
          } else if (err.request) {
            // Client never received a response, or request never left:
            setMessageToUser('Connection unavailable at the moment!');
          } else {
            // Anything else:
            setMessageToUser('Connection unavailable at the moment!');
          }
        });
    }
  }
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.title}>Create Account</h1>
        <form onSubmit={signUpUserHandler}>
          <div className="input-block">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={classes.grid}>
            <div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                minlength="3"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                placeholder="Password Confirm"
                minlength="3"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          </div>
          <div className={classes.maxWidth}>
            <p className={classes.setCoordinates}>Coordinates (optional)</p>
          </div>
          <div className={classes.grid}>
            <div>
              <input
                type="number"
                name="latitude"
                id="latitude"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
            <div>
              <input
                type="number"
                name="longiture"
                id="longiture"
                placeholder="Longiture"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </div>

          <div className={classes.grid}>
            <button onClick={setCoordinates} className={classes.btnCoordinates}>
              {/* <img className={classes.facebookImg} src={facebookFavicon} /> */}
              <h3 className={classes.btnText}>Set Coordinates</h3>
            </button>
            <button type="submit" className={classes.btnSignup}>
              <h3 className={classes.btnTextSignUp}>SIGN UP</h3>
            </button>
          </div>
        </form>
        Have an account?{' '}
        <span className={classes.logSignClick} onClick={props.toogleComponent}>
          Log in
        </span>
        <h2 className="errorMessage">{messageToUser}</h2>
        <h2 className="errorMessage">{spinner}</h2>
        <div className={classes.imgBox}>
          {/* <img className={classes.gitLogoSignupImg} src={gitLogo} alt="" /> */}
          <div className={classes.imgBox}>
            {/* <img className={classes.gitLogoImg} src={gitLogo} alt="" /> */}
            <UseAnimations
              animation={github}
              size={120}
              autoplay={true}
              loop={true}
              wrapperStyle={{ margin: 'auto' }}
            />
          </div>
        </div>
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
