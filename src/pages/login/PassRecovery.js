import React, { useState, useEffect } from 'react';
import api from '../../../src/services/api';

import './passRecovery.style.css';
import Spinner from 'react-bootstrap/Spinner';
import classes from './style.module.scss';

export default function EditDev(props) {
  const [email, setEmail] = useState('');
  const [messageToUser, setMessageToUser] = useState('');

  // AVOID MESSAGE: Can't perform a React state update on an unmounted component:
  let isMounted = true;
  useEffect(() => {
    return () => {
      // Called when the component is going to unmount:
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMounted) {
        setMessageToUser('');
      }
    }, 4000);
    return () => {
      clearTimeout(timer);
    };
  }, [messageToUser]);

  function recoverPasswordHandler(e) {
    e.preventDefault();
    if (email === '') {
      setMessageToUser('Please provide a registered email!');
    } else {
      setMessageToUser(
        <div className={classes.spinerContainer}>
          <Spinner animation="border" role="status" variant="info" />
        </div>
      );
      api
        .post('/emails', {
          email,
        })
        .then((res) => {
          // console.log(res.data);
          props.cancelPassRecoveryHandler();
          props.passRecoverySucceed();
        })
        .catch((err) => {
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
  }

  function cancelHandler(e) {
    e.preventDefault();
    props.cancelPassRecoveryHandler();
  }

  return (
    <div className="backdropPass">
      <div className="editFormContainerPass">
        <aside>
          <form onSubmit={recoverPasswordHandler}>
            <p className="developersName">
              Provide the registered email and
              <br />
              you will get your password by email:
            </p>
            <div className="input-block">
              <input
                className={classes.inputMail}
                type="email"
                name="email"
                id="email"
                // placeholder={props.developer.techs}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="buttons-grid">
              <div>
                <button
                  className="btnCancel"
                  type="submit"
                  onClick={cancelHandler}
                >
                  Cancel
                </button>
              </div>
              <div>
                <button type="submit" className="btnSave">
                  Send
                </button>
              </div>
            </div>
            <h2 className="errorMessageSmaller">{messageToUser}</h2>
          </form>
        </aside>
      </div>
    </div>
  );
}
