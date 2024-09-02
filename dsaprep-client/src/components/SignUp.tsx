import {
  Button,
  Flex,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";

type SignUpPropsType = {
  setLogin: Dispatch<SetStateAction<boolean>>;
};

const SignUp: React.FC<SignUpPropsType> = ({ setLogin }) => {
  const [signupForm, setSignupForm] = useState<boolean>(false);
  const navigate = useNavigate();
  const form = useForm({
    mode: "uncontrolled",
    validateInputOnBlur: true,
    initialValues: { firstName: "", lastName: "", email: "", password: "" },
    validate: {
      firstName: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      lastName: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 8 ? "Password must be atleast 8 characters" : null,
    },
  });

  const signin = async (values: typeof form.values) => {
    setSignupForm(true);
    try {
      const response = await axios({
        method: "post",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        url:
          import.meta.env.VITE_BASE_URL +
          import.meta.env.VITE_API_VERSION +
          "/auth/register",
        data: JSON.stringify(values),
      });

      if (response.status === 200) {
        localStorage.setItem("jwt", response.data.token);
        setSignupForm(false);
        navigate("/home");
      }
    } catch (err) {
      setSignupForm(false);
      showNotification({
        title: "Error",
        message: "could not sign you in",
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
  };
  return (
    <Flex h={"80vh"} w={"100vw"} justify={"center"} align={"center"}>
      <Paper
        pos={"relative"}
        p={"xl"}
        h={500}
        w={700}
        bg={"blackColor.8"}
        shadow="lg"
        radius={"lg"}
      >
        <LoadingOverlay
          visible={signupForm}
          zIndex={1000}
          overlayProps={{ radius: "lg", blur: 2 }}
          loaderProps={{ color: "greenColor.8" }}
        />
        <form onSubmit={form.onSubmit(signin)}>
          <TextInput
            mt="sm"
            label="First Name"
            placeholder="First Name"
            key={form.key("firstName")}
            variant="filled"
            withAsterisk
            {...form.getInputProps("firstName")}
          />
          <TextInput
            mt="sm"
            label="Last Name"
            placeholder="Last Name"
            key={form.key("lastName")}
            variant="filled"
            withAsterisk
            {...form.getInputProps("lastName")}
          />
          <TextInput
            mt="sm"
            label="Email"
            placeholder="Email"
            key={form.key("email")}
            variant="filled"
            withAsterisk
            {...form.getInputProps("email")}
          />
          <PasswordInput
            mt="sm"
            label="Password"
            placeholder="Password"
            key={form.key("password")}
            variant="filled"
            withAsterisk
            {...form.getInputProps("password")}
          />
          <Button type="submit" mt="sm" color="greenColor.8">
            Submit
          </Button>
        </form>
        <Text mt={"md"} size="sm">
          Already have an account{" "}
          <span
            style={{ color: "steelblue", cursor: "pointer" }}
            onClick={() => setLogin(true)}
          >
            Login
          </span>
        </Text>
      </Paper>
    </Flex>
  );
};

export default SignUp;
