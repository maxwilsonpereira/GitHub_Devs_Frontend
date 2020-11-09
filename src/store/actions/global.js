import * as actionTypes from "./actionsTypes";

export const login = (email, id, token) => {
  return {
    type: actionTypes.LOGIN,
    email,
    id,
    token,
  };
};

export const logout = () => {
  return {
    type: actionTypes.LOGOUT,
  };
};
