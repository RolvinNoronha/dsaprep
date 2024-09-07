import { Progress, Stack, Title } from "@mantine/core";
import React from "react";

const SolvedProgress: React.FC = () => {
  return (
    <Stack miw={"10%"}>
      <Title order={3}>Progress</Title>
      <Progress.Root size="xl">
        <Progress.Section color="green" value={35}>
          <Progress.Label>Documents</Progress.Label>
        </Progress.Section>
      </Progress.Root>
      <Progress.Root size="xl">
        <Progress.Section color="yellow" value={35}>
          <Progress.Label>Documents</Progress.Label>
        </Progress.Section>
      </Progress.Root>
      <Progress.Root size="xl">
        <Progress.Section color="red" value={35}>
          <Progress.Label>Documents</Progress.Label>
        </Progress.Section>
      </Progress.Root>
    </Stack>
  );
};

export default SolvedProgress;
