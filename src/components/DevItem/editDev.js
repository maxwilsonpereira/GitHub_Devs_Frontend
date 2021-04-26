import React, { useState, useEffect } from "react";
import api from "../../../src/services/api";

import "../DevForm/styles.scss";
import "./styles.css";
import Spinner from "react-bootstrap/Spinner";

export default function EditDev(props) {
  const [techs, setTechs] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [about, setAbout] = useState("");
  const [messageToUser, setMessageToUser] = useState("");
  const [spinner, setSpinner] = useState("");

  useEffect(() => {
    // FILLING the form with the current data:
    setTechs(props.developer.techs[0]);
    setLatitude(props.developer.location.coordinates[1]);
    setLongitude(props.developer.location.coordinates[0]);
    setAbout(props.developer.about);
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

  // AVOID MESSAGE: Can't perform a React state update on an unmounted component:
  let isMounted = true;
  useEffect(() => {
    return () => {
      // Called when the component is going to unmount:
      isMounted = false;
    };
  }, []);

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

  function updateDevHandler(e) {
    e.preventDefault();
    setMessageToUser(
      <div className="spinerContainer">
        <Spinner animation="border" role="status" variant="info" />
      </div>
    );
    // JSON.stringify() for ARRAY comparison to verify if any
    // change was made:
    if (
      techs === props.developer.techs[0] &&
      latitude === props.developer.location.coordinates[1] &&
      longitude === props.developer.location.coordinates[0] &&
      about === props.developer.about
    ) {
      setSpinner("");
      setMessageToUser("No change were made!");
    } else if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      setSpinner("");
      setMessageToUser("Wrong coordinates!");
    } else {
      // UPDATING DEVELOPER:
      const curUserId = localStorage.getItem("idUser");

      api
        .put(`/devs/${curUserId}/${props.developer._id}`, {
          techs,
          latitude,
          longitude,
          about,
        })
        .then((res) => {
          setSpinner("");
          if (isMounted) {
            setMessageToUser(res.data.message);
            props.refreshDevsHandlers();
            // CLOSING UPDATE DEV WINDOW:
            props.cancelEditDevHandler();
          }
        })
        .catch((err) => {
          setSpinner("");
          if (err.response) {
            // if (isMounted) {
            setMessageToUser(err.response.data.message);
            // }
          } else if (err.request) {
            // Client never received a response, or request never left:
            // console.log("Connection failed! Please contact us!");
            setMessageToUser(err.response.data.message);
          } else {
            // Anything else:
            // console.log("Please contact us!");
            setMessageToUser(err.response.data.message);
          }
        });
    }
  }

  function cancelHandler(e) {
    e.preventDefault();
    props.cancelEditDevHandler();
  }

  return (
    <div className="backdrop">
      <div className="editFormContainer">
        <aside>
          <form onSubmit={updateDevHandler}>
            <p className="developersName">
              <span
                style={{
                  color: "darkred",
                }}
              >
                Editing{" "}
              </span>

              {props.developer.name
                ? props.developer.name
                : props.developer.github_username}
            </p>
            <div className="input-block">
              <label htmlFor="techs">Technologies</label>
              <input
                name="techs"
                id="techs"
                required
                // placeholder={props.developer.techs}
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
                // placeholder={props.developer.about}
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
                  // placeholder={props.developer.location.coordinates.slice(1)}
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
                  // placeholder={props.developer.location.coordinates.slice(0, 1)}
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </div>
            </div>
            <button className="btnCoordinates" onClick={setCoordinates}>
              Set Coordinates (Optional)
            </button>
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
                <button className="btnSave" type="submit">
                  Save
                </button>
              </div>
            </div>
            <h2 className="errorMessage">{messageToUser}</h2>
            <h2 className="errorMessage">{spinner}</h2>
          </form>
        </aside>
      </div>
    </div>
  );
}
