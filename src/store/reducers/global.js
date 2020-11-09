// Because this app doesn't need many REDUX States,
// I decided to use just one global.js file:

import * as actionTypes from "../actions/actionsTypes";

const initialState = {
  isLogged: localStorage.getItem("isLogged"),
  emailUser: localStorage.getItem("emailUser"),
  idUser: localStorage.getItem("idUser"),
  token: localStorage.getItem("token"),
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      localStorage.setItem("isLogged", "true");
      localStorage.setItem("emailUser", action.email);
      localStorage.setItem("idUser", action.id);
      localStorage.setItem("token", action.token);

      return {
        ...state,
        isLogged: "true",
        nameUser: action.name,
        emailUser: action.email,
        idUser: action.id,
        token: action.token,
      };

    case actionTypes.LOGOUT:
      return {
        ...state,
        isLogged: "false",
        nameUser: null,
        emailUser: null,
        idUser: null,
        token: null,
      };

    default:
      return state;
  }
};
export default reducer;
