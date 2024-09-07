import { Container, Group, Select, Stack, Title } from "@mantine/core";
import React from "react";

const Settings: React.FC = () => {
  return (
    <Container>
      <Stack>
        <Group justify="space-between">
          <Title order={5}>Font Size: </Title>
          <Select
            label="Select font size (px)"
            //   placeholder="P"
            checkIconPosition="right"
            //   onChange={changeLanguage}
            data={["12", "14", "16", "18"]}
            defaultValue={"12"}
          />
        </Group>
        <Group justify="space-between">
          <Title order={5}>Font Family: </Title>
          <Select
            label="Select font family"
            //   placeholder="P"
            checkIconPosition="right"
            //   onChange={changeLanguage}
            data={[
              "Consolas",
              "Courier New",
              "monospace",
              "Hasklig",
              "Fira Code",
            ]}
            defaultValue={"Consolas"}
          />
        </Group>
        <Group justify="space-between" mb={"lg"}>
          <Title order={5}>Editor Theme: </Title>
          <Select
            label="Select theme"
            //   placeholder="P"
            checkIconPosition="right"
            //   onChange={changeLanguage}
            data={["VS Dark", "Cobalt", "Monokai"]}
            defaultValue={"VS Dark"}
          />
        </Group>
      </Stack>
    </Container>
  );
};

export default Settings;
