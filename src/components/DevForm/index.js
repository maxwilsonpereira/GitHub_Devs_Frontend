import React, { useState, useEffect } from "react";
import api from "../../../src/services/api";

import "./styles.scss";
import classes from "../../pages/login/style.module.scss";
import Spinner from "react-bootstrap/Spinner";

function DevForm({ refreshDevsHandlers }) {
  const [github_username, setGithubUsername] = useState("");
  const [techs, setTechs] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [about, setAbout] = useState("");
  const [messageToUser, setMessageToUser] = useState("");
  const [spinner, setSpinner] = useState("");

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

  async function createDevHandler(e) {
    e.preventDefault();
    setMessageToUser(
      <div className="spinerContainer">
        <Spinner animation="border" role="status" variant="info" />
      </div>
    );
    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setSpinner("");
      setMessageToUser("Wrong coordinates!");
    } else {
      const curIserId = localStorage.getItem("idUser");
      // CREATE (POST) DEVELOPER:
      await api
        .post(`/devs/${curIserId}`, {
          github_username,
          techs,
          latitude,
          longitude,
          about,
        })
        .then((res) => {
          if (isMounted) {
            setSpinner("");
            setMessageToUser(res.data.message);
            // Could also be imported as (props)
            // an used as props.refreshDevsHandlers:
            refreshDevsHandlers();
          }
        })
        .catch((err) => {
          setSpinner("");
          if (err.response) {
            if (isMounted) {
              setMessageToUser(err.response.data.message);
            }
          } else if (err.request) {
            // Client never received a response, or request never left:
            // console.log("Connection failed! Please contact us!");
            setMessageToUser("Connection unavailable at the moment!");
          } else {
            // Anything else:
            // console.log("Please contact us!");
            setMessageToUser("Connection unavailable at the moment!");
          }
        });

      setGithubUsername("");
      setTechs("");
      setLatitude("");
      setLongitude("");
      setAbout("");
    }
  }

  return (
    <form onSubmit={createDevHandler}>
      <div className="input-block">
        <label htmlFor="github_username">
          GutHub Username <i>(Example: Max)</i>
        </label>
        <input
          name="github_username"
          id="github_username"
          required
          value={github_username}
          onChange={(e) => setGithubUsername(e.target.value)}
        />
      </div>
      <div className="input-block">
        <label htmlFor="techs">
          Technologies <i>(Example: React, Node.js)</i>
        </label>
        <input
          name="techs"
          id="techs"
          required
          value={techs}
          onChange={(e) => setTechs(e.target.value)}
        />
      </div>
      <div className="input-block">
        <label htmlFor="about">About (Optional)</label>
        <textarea
          className="about-text-area"
          name="about"
          id="about"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
      </div>
      <div className="input-group">
        <div className="input-block">
          <label htmlFor="latitude">Latitude</label>
          <input
            type="number"
            name="Latitude"
            id="Latitude"
            placeholder="Optional"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </div>
        <div className="input-block">
          <label htmlFor="longitude">Longitude</label>
          <input
            type="number"
            name="Longiture"
            id="Longiture"
            placeholder="Optional"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>
      </div>
      <div className={classes.gridDevelopersForm}>
        <button onClick={setCoordinates} className={classes.btnCoordinatesDevs}>
          {/* <img className={classes.facebookImg} src={facebookFavicon} /> */}
          <h3 className={classes.btnText}>Set Coordinates</h3>
        </button>
        <button type="submit" className={classes.btnSignupDevs}>
          <h3 className={classes.btnText}>SAVE</h3>
        </button>
      </div>
      <h2 className="errorMessage">{messageToUser}</h2>
      <h2 className="errorMessage">{spinner}</h2>
    </form>
  );
}

export default DevForm;
