import {
  Container,
  Group,
  Input,
  MultiSelect,
  Select,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { IoSearch } from "react-icons/io5";
import Problems from "../components/Home/Problems";
import { CATEGORIES, DIFFICULTY, STATUS } from "../utils/constants";
// import SolvedProgress from "../components/SolvedProgress";

export type Problem = {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  order: number;
  videoId?: string;
  solved: boolean;
};

export const problems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    order: 1,
    videoId: "8-k1C6ehKuw",
    solved: true,
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Hard",
    category: "Linked List",
    order: 2,
    videoId: "",
    solved: false,
  },
  {
    id: "jump-game",
    title: "Jump Game",
    difficulty: "Medium",
    category: "Dynamic Programming",
    order: 3,
    videoId: "",
    solved: false,
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    order: 4,
    videoId: "xty7fr-k0TU",
    solved: false,
  },
  {
    id: "search-a-2d-matrix",
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    category: "Binary Search",
    order: 5,
    videoId: "ZfFl4torNg4",
    solved: true,
  },
  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Two Pointers",
    order: 6,
    videoId: "",
    solved: false,
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "intervals",
    order: 7,
    videoId: "",
    solved: true,
  },
  {
    id: "maximum-depth-of-binary-tree",
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    category: "Tree",
    order: 8,
    videoId: "4qYTqOiRMoM",
    solved: true,
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Array",
    order: 9,
    videoId: "",
    solved: false,
  },
  {
    id: "subsets",
    title: "Subsets",
    difficulty: "Medium",
    category: "Backtracking",
    order: 10,
    videoId: "",
    solved: false,
  },
];

const Home: React.FC = () => {
  // const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>("");

  useEffect(() => {
    if (difficultyFilter != null) {
    }
  }, [difficultyFilter, statusFilter, categoryFilter, searchFilter]);

  return (
    <Container fluid h={"100vh"} mx={0}>
      <Header isWorkspace={false} />
      <Container mt={"xl"} mb={"xl"} mx={10} fluid>
        <Title ta={"center"} order={2} mb={"md"}>
          Problems
        </Title>
        <Group justify="center" align="flex-end">
          <Select
            label="Difficulty"
            placeholder="select difficulty"
            data={DIFFICULTY}
            clearable
            checkIconPosition="right"
            onChange={(value) => setDifficultyFilter(value)}
          />
          <Select
            label="Status"
            placeholder="select status"
            data={STATUS}
            clearable
            checkIconPosition="right"
            onChange={(value) => setStatusFilter(value)}
          />
          <MultiSelect
            label="Category"
            placeholder="select category"
            data={CATEGORIES}
            maxDropdownHeight={150}
            searchable
            clearable
            checkIconPosition="right"
            nothingFoundMessage="Nothing found..."
            // withScrollArea={true}
            maxLength={10}
            onChange={(value) => setCategoryFilter(value)}
          />
          <Input
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="search questions"
            leftSection={<IoSearch size={16} />}
          />
        </Group>
      </Container>
      <Container mt={"md"} mx={20} fluid>
        <Group justify="center" align="center">
          <Problems problems={problems} />
          {/* <SolvedProgress /> */}
        </Group>
      </Container>
    </Container>
  );
};

export default Home;
