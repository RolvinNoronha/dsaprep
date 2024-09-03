import { Button, Container, Stack, Title } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Container fluid mx={0} h={"100vh"}>
      <Stack justify="center" align="center" h={"100%"}>
        <Title order={3}>404 | Page Not Found</Title>
        <Button size="md" color="greenColor.8" onClick={() => navigate("/")}>
          Go To Home
        </Button>
      </Stack>
    </Container>
  );
};

export default NotFound;
