import { Container } from "@mantine/core";
import React, { useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";

const Auth: React.FC = () => {
  const [login, setLogin] = useState<boolean>(false);

  return (
    <Container mx={0} fluid h={"100vh"}>
      {login ? <Login setLogin={setLogin} /> : <SignUp setLogin={setLogin} />}
    </Container>
  );
};

export default Auth;
