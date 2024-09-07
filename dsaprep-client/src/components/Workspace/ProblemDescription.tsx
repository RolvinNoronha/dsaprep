import { Code, Container, Group, List, Text, Title } from "@mantine/core";
import React from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";

type ExamplesType = {
  Input: string;
  Output: String;
  Explanation?: string;
};

const Examples: ExamplesType[] = [
  {
    Input: "nums = [2,7,11,15], target = 9",
    Output: "[0,1]",
    Explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]",
  },
  { Input: "nums = [3,2,4], target = 6", Output: "[1,2]" },
  {
    Input: "nums = [3,3], target = 6",
    Output: "[0,1]",
  },
];

const ProblemDescription: React.FC = () => {
  return (
    <Container>
      <Title order={4} my={"lg"}>
        1. Problem Title
      </Title>
      <Group mb={"md"}>
        <Text c={"green"}>Easy</Text>
        <AiFillLike size={"1.2rem"} />
        <AiFillDislike size={"1.2rem"} />
      </Group>
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore eveniet
        dignissimos vero consequuntur harum voluptatum aliquam consectetur
        placeat quaerat. Delectus.
      </Text>
      {Examples.map((example, idx) => {
        return (
          <Code block={true} my={"md"}>
            <Title order={6} mb={"sm"}>
              {"Example " + (idx + 1)}
            </Title>
            <Text>{"Input: " + example.Input}</Text>
            <Text>{"Output: " + example.Output}</Text>
            <Text>{"Explanation: " + example.Explanation}</Text>
          </Code>
        );
      })}
      <Title order={6} mb={"sm"}>
        Constraints:
      </Title>
      <List mb={"lg"}>
        <List.Item>{"2 <= nums.length <= 104"}</List.Item>
        <List.Item>{"-109 <= nums[i] <= 109"}</List.Item>
        <List.Item>{"-109 <= target <= 109"}</List.Item>
        <List.Item>{"Only one valid answer exists."}</List.Item>
      </List>
    </Container>
  );
};

export default ProblemDescription;
