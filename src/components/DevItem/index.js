import React, { useState, memo } from "react";
import api from "../../../src/services/api";

import "./styles.css";

import EditDevForm from "./editDev";
// https://react-icons.github.io/react-icons/
import { FiTrash2 } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";

function DevItem(props) {
  const [showEditDevForm, setShowEditDevForm] = useState("");

  async function deleteDevHandler() {
    const curIserId = localStorage.getItem("idUser");
    await api
      .delete(`/devs/${curIserId}/${props.dev._id}`)
      .then((res) => {
        // console.log(res.data);
        props.refreshDevsHandlers();
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function editDevHandler() {
    setShowEditDevForm(
      <EditDevForm
        developer={props.dev}
        cancelEditDevHandler={cancelEditDevHandler}
        deleteDevHandler={deleteDevHandler}
        refreshDevsHandlers={props.refreshDevsHandlers}
      />
    );
  }
  function cancelEditDevHandler() {
    setShowEditDevForm(null);
  }

  return (
    <>
      {showEditDevForm}
      <li className="dev-item">
        <header>
          <img src={props.dev.avatar_url} alt={props.dev.name} />
          <div className="user-info">
            <strong>
              {props.dev.name ? props.dev.name : props.dev.github_username}
            </strong>
            {/* <strong>{props.dev.github_username}</strong>
          <strong>{props.dev.name}</strong> */}
            <span>{props.dev.techs.join(", ")}</span>
          </div>
        </header>
        <p>{props.dev.bio}</p>
        {props.dev.about ? (
          <>
            <p className="pBigger">Your Opinion:</p>
            <p>{props.dev.about}</p>
          </>
        ) : null}

        <a
          href={`https://github.com/${props.dev.github_username}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to GitHub Profile
        </a>
        <div className="iconTrash" onClick={deleteDevHandler}>
          <FiTrash2 size={16} color="grey" />
        </div>
        <div className="iconEdit" onClick={editDevHandler}>
          <FiEdit size={16} color="grey" />
        </div>
      </li>
    </>
  );
}

export default memo(DevItem);
