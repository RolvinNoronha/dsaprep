import { Container } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Login from "../components/Auth/Login";
import SignUp from "../components/Auth/SignUp";
import Header from "../components/Header/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";

const Auth: React.FC = () => {
  const [login, setLogin] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        const jwt = localStorage.getItem("jwt");
        if (jwt !== null) {
          const response = await axios({
            method: "get",
            headers: {
              Authorization: `Bearer ${jwt}`,
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
            },
            url:
              import.meta.env.VITE_BASE_URL +
              import.meta.env.VITE_API_VERSION +
              "/authenticated",
          });

          if (response.status === 200) {
            navigate("/");
          }
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 403 || err.response?.status == 401) {
            showNotification({
              title: "Session Expired",
              message: "please login again",
              color: "white",
              style: { backgroundColor: "red" },
              position: "top-left",
              w: "20rem",
              styles: (theme) => ({
                title: { color: theme.white },
                description: { color: theme.white },
              }),
            });
            navigate("/");
          } else {
            showNotification({
              title: "Error",
              message: "refresh and try again",
              color: "white",
              style: { backgroundColor: "red" },
              position: "top-left",
              w: "20rem",
              styles: (theme) => ({
                title: { color: theme.white },
                description: { color: theme.white },
              }),
            });
          }
        }
      }
    };

    isAuthenticated();
  });

  return (
    <Container mx={0} fluid h={"100vh"}>
      <Header />
      {login ? <Login setLogin={setLogin} /> : <SignUp setLogin={setLogin} />}
    </Container>
  );
};

export default Auth;
