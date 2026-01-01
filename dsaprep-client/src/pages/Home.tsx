import {
  Container,
  Group,
  Input,
  MultiSelect,
  Select,
  Title,
  Loader,
  Text
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { IoSearch } from "react-icons/io5";
import Problems from "../components/Home/Problems";
import { CATEGORIES, DIFFICULTY, STATUS } from "../utils/constants";
import axios from "axios";

export type Problem = {
  id: string; // This will store the slug
  dbId: number;
  title: string;
  difficulty: string;
  category: string;
  order: number;
  videoId?: string;
  solved: boolean;
};

const Home: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");

  useEffect(() => {
    const fetchProblems = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_VERSION}/problems`
            );
            const fetchedProblems = response.data.map((p: any) => ({
                id: p.slug,
                dbId: p.id,
                title: p.title,
                difficulty: p.difficulty,
                category: "Algorithms", // Placeholder
                order: p.id,
                videoId: "",
                solved: false // Placeholder
            }));
            setProblems(fetchedProblems);
        } catch (error) {
            console.error("Error fetching problems:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchProblems();
  }, []);

  const filteredProblems = problems.filter((problem) => {
    const matchesDifficulty = difficultyFilter ? problem.difficulty === difficultyFilter : true;
    const matchesSearch = problem.title.toLowerCase().includes(searchFilter.toLowerCase());
    // Status and Category filters are placeholders for now
    return matchesDifficulty && matchesSearch;
  });

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
            maxLength={10}
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
            {loading ? <Loader /> : (
                filteredProblems.length > 0 ? <Problems problems={filteredProblems} /> : <Text>No problems found</Text>
            )}
        </Group>
      </Container>
    </Container>
  );
};

export default Home;
