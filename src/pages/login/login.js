import React, { useState, useEffect } from 'react';
import * as actionTypes from '../../store/actions/actionsIndex';
import { connect } from 'react-redux';

import api from '../../services/api';
import facebookApi from '../../services/facebookApi';

import '../../components/DevForm/styles.scss';
import Spinner from 'react-bootstrap/Spinner';
import classes from './style.module.scss';
import gitLogo from '../../assets/gitlogo.png';
import PassRecovery from './PassRecovery';
// import facebookFavicon from "../../assets/facebook.png";

export function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passRecovery, setPassRecovery] = useState('');
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

  async function loginHandler(e) {
    e.preventDefault();
    setSpinner(
      <div className={classes.spinerContainer}>
        <Spinner animation="border" role="status" variant="info" />
      </div>
    );
    // LOGIN:
    await api
      .post('/login', {
        email,
        password,
      })
      .then((res) => {
        setSpinner('');
        // console.log(res.data);
        props.onLogIn(res.data.email, res.data.id, res.data.token);
      })
      .catch((err) => {
        setSpinner('');
        if (err.response) {
          // Client received an error response (5xx, 4xx):
          setMessageToUser(err.response.data.message);
          // MESSAGE COMING FROM BACKEND: Email not registered!
        } else if (err.request) {
          // Client never received a response, or request never left:
          setMessageToUser('Connection unavailable at the moment!');
        } else {
          // Anything else:
          setMessageToUser('Connection unavailable at the moment!');
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
    setPassRecovery('');
  }
  function passRecoverySucceed() {
    setMessageToUser('Please check your email for the password!');
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
        <div className={classes.content}>
          <h1 className={classes.title}>My GitHub Devs</h1>
          <form onSubmit={loginHandler}>
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
            <div className="input-block">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                minlength="3"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className={classes.btnLogin}>
              LOG IN
            </button>
            <br />
            {/* <button onClick={loginWithFacebook} className={classes.facebookBtn}>
              <h3 className={classes.btnText}>Log in with Facebook</h3>
            </button> */}
          </form>
          Don't have an account?{' '}
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
          <h2 className="errorMessage">{spinner}</h2>
          <div className={classes.imgBox}>
            <img className={classes.gitLogoImg} src={gitLogo} alt="" />
          </div>
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
