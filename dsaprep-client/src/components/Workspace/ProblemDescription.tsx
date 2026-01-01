import { Code, Container, Group, Text, Title, Loader } from "@mantine/core";
import React from "react";
import { AiFillDislike, AiFillLike } from "react-icons/ai";

export type ProblemDetails = {
    dbId: number;
    title: string;
    slug: string;
    description: string;
    difficulty: string;
    exampleTestCases: string; // JSON string
    constraints: string;
};

type Props = {
    problem: ProblemDetails | null;
    loading: boolean;
};

const ProblemDescription: React.FC<Props> = ({ problem, loading }) => {
  if (loading) {
      return <Loader />;
  }

  if (!problem) {
      return <Text>Problem not found</Text>;
  }

  // Parse exampleTestCases if it's a JSON string, otherwise handle as plain text or ignore for now
  // Assuming simple text format for now based on what I see
  
  return (
    <Container>
      <Title order={4} my={"lg"}>
        {problem.dbId}. {problem.title}
      </Title>
      <Group mb={"md"}>
        <Text c={problem.difficulty === 'Easy' ? "green" : problem.difficulty === 'Medium' ? "yellow" : "red"}>
            {problem.difficulty}
        </Text>
        <AiFillLike size={"1.2rem"} />
        <AiFillDislike size={"1.2rem"} />
      </Group>
      <Text>
        {problem.description}
      </Text>
      
      {/* 
        Ideally we would parse exampleTestCases here. 
        For now just displaying raw if available or placeholders if you want.
      */}
      {problem.exampleTestCases && (
        <Code block={true} my={"md"}>
             <Title order={6} mb={"sm"}>Examples</Title>
             <Text>{problem.exampleTestCases}</Text>
        </Code>
      )}

      <Title order={6} mb={"sm"}>
        Constraints:
      </Title>
      <Code block={true}>
        <Text>{problem.constraints}</Text>
      </Code>
    </Container>
  );
};

export default ProblemDescription;
