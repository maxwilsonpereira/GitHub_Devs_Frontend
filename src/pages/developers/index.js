import React, { useState, useEffect, useCallback } from "react";
import * as actionTypes from "../../store/actions/actionsIndex";
import { connect } from "react-redux";

import api from "../../../src/services/api";

import "bootstrap/dist/css/bootstrap.min.css";
import "./Aside.css";
import Spinner from "react-bootstrap/Spinner";

import DevItem from "../../components/DevItem";
import DevForm from "../../components/DevForm";

function Developers(props) {
  const [devs, setDevs] = useState([]);
  const [messageToUser, setMessageToUser] = useState("");
  const [messageToUserNoErase, setMessageToUserNoErase] = useState("");
  const idCurUser = localStorage.getItem("idUser");
  let devsAvailable = false;

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
        setMessageToUser("");
      }
    }, 4000);
    return () => {
      clearTimeout(timer);
    };
  }, [messageToUser]);

  useEffect(() => {
    refreshDevsHandlers();
  }, []);

  const refreshDevsHandlers = useCallback(async () => {
    setMessageToUserNoErase(
      <div className="spinerContainer">
        <Spinner animation="border" role="status" variant="info" />
      </div>
    );
    // async function loadDevs() {
    await api
      .get(`/devs/${idCurUser}`, {
        headers: {
          // "Bearer " is a convention of Authentication Token:
          Authorization: "Bearer " + props.token,
        },
      })
      .then((res) => {
        // console.log(res.data);
        if (isMounted) {
          // Checking if array is NULL or EMPTY:
          if (
            res.data == null ||
            res.data === undefined ||
            res.data.length == 0
          ) {
            // IF NO developers SAVED / AVAILABLE:
            setDevs([]);
            setMessageToUserNoErase(
              "You still didn't add any developer! How about adding maxwilsonpereira?"
            );
            devsAvailable = false;
          } else {
            // IF developers SAVED / AVAILABLE:
            setMessageToUserNoErase("");
            setDevs(res.data);
            devsAvailable = true;
          }
        }
      })
      .catch((err) => {
        if (err.response) {
          // Client received an error response (5xx, 4xx):
          setMessageToUserNoErase(err.response.data.message);
          // MESSAGE: User not found!
          // LOG "FAKE" USER OUT:
          setTimeout(() => {
            logOutHandler();
          }, 4000);
          // MESSAGE COMING FROM BACKEND: User not found!!
        } else if (err.request) {
          // Client never received a response, or request never left:
          setMessageToUserNoErase("Connection unavailable at the moment!");
        } else {
          // Anything else:
          setMessageToUserNoErase("Connection unavailable at the moment!");
        }
      });
  });

  function logOutHandler() {
    props.onLogOut();
    localStorage.clear();
  }

  return (
    <>
      <div className="navigation">
        <div className="maxWidth">
          {/* <p onClick={aboutHandler}>ABOUT</p> */}
          <p onClick={logOutHandler}>LOGOUT</p>
        </div>
      </div>

      <h1 className="titleMain">Your favorite developers in one place!</h1>
      <div id="app">
        <aside>
          <strong>Register New Developer</strong>
          <DevForm refreshDevsHandlers={refreshDevsHandlers} />
        </aside>
        <main>
          <ul>
            {devs.map((dev) => (
              <DevItem
                key={dev._id}
                dev={dev}
                refreshDevsHandlers={refreshDevsHandlers}
              />
            ))}
          </ul>
          <h2 className="errorMessageNoEraseDiv">{messageToUserNoErase}</h2>
        </main>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    // isLogged: state.global.isLogged,
    // nameUser: state.global.nameUser,
    // emailUser: state.global.emailUser,
    idUser: state.global.idUser,
    token: state.global.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogOut: () => dispatch(actionTypes.logout()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Developers);
