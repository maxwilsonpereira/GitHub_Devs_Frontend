import React, { useState } from "react";

import Login from "./login";
import Signup from "./signup";

export default function LoginPage() {
  const [showWhat, setShowWhat] = useState(
    <Login toogleComponent={toogleComponent} />
  );
  let signUp = true;

  function toogleComponent() {
    // console.log(signUp);
    if (signUp) {
      setShowWhat(<Signup toogleComponent={toogleComponent} />);
      signUp = false;
    } else {
      setShowWhat(<Login toogleComponent={toogleComponent} />);
      signUp = true;
    }
  }

  return <>{showWhat}</>;
}
