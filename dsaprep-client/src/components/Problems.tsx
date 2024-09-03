import { Table } from "@mantine/core";
import React from "react";
import { Problem } from "../pages/Home";
import { FaRegCheckCircle } from "react-icons/fa";

type ProblemsPropsType = {
  problems: Problem[];
};

const Problems: React.FC<ProblemsPropsType> = ({ problems }) => {
  return (
    <Table verticalSpacing={"md"} highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Status</Table.Th>
          <Table.Th>Title</Table.Th>
          <Table.Th>Difficulty</Table.Th>
          <Table.Th>Category</Table.Th>
          <Table.Th>Solution</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {problems.map((prob) => {
          return (
            <Table.Tr key={prob.id}>
              <Table.Td>
                {prob.solved ? (
                  <FaRegCheckCircle size={18} color="green" />
                ) : null}
              </Table.Td>
              <Table.Td>{prob.title}</Table.Td>
              <Table.Td>{prob.difficulty}</Table.Td>
              <Table.Td>{prob.category}</Table.Td>
              <Table.Td>{prob.videoId}</Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};

export default Problems;
