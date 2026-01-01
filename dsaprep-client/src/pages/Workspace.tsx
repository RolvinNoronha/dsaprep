import {
  Badge,
  Button,
  Code,
  Container,
  Group,
  Loader,
  Select,
  Stack,
  Tabs,
  Text,
  Title
} from "@mantine/core";
import React, { useRef, useState, useEffect } from "react";
import Header from "../components/Header/Header";
import { Editor } from "@monaco-editor/react";
import { CODE_SNIPPETS, LANGUAGES } from "../utils/constants";
import Split from "react-split";
import { AiOutlineFullscreen } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import ProblemDescription, { ProblemDetails } from "../components/Workspace/ProblemDescription";
import { useFullscreen } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import Settings from "../components/Workspace/Settings";
import { useParams } from "react-router-dom";
import axios from "axios";
import { showNotification } from "@mantine/notifications";

export type OptionsType = {
  fontFamily: string;
  fontSize: number;
  theme: string;
  tabSize: number;
};

type RunResult = {
  stdout?: string;
  stderr?: string;
  compileOutput?: string;
  message?: string;
  status?: { id: number; description: string };
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  passed?: boolean;
  passedCount?: number;
  totalCount?: number;
  testCaseResults?: Array<{
    testCaseNumber: number;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    errorMessage?: string;
  }>;
};

type SubmissionItem = {
  id: number;
  status: string;
  runTime: number;
  memory: number;
  createdAt: string;
  languageId: number;
};

const Workspace: React.FC = () => {
  const { pid } = useParams();
  const [problem, setProblem] = useState<ProblemDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState<boolean>(false);

  const editorRef = useRef<any | undefined>();
  const [language, setLanguage] = useState<string | null>("python");
  const [value, setValue] = useState<string | undefined>(
    // @ts-ignore
    CODE_SNIPPETS[language]
  );

  const [options, setOptions] = useState<OptionsType>({
    fontFamily: "Consolas",
    fontSize: 14,
    theme: "vs-dark",
    tabSize: 4,
  });

  const { ref, toggle } = useFullscreen();

  useEffect(() => {
    const fetchProblem = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_VERSION}/problems/${pid}`
            );
            // Map backend response to ProblemDetails
            const p = response.data;
            setProblem({
                dbId: p.id,
                title: p.title,
                slug: p.slug,
                description: p.description,
                difficulty: p.difficulty,
                exampleTestCases: p.exampleTestCases,
                constraints: p.constraints
            });
        } catch (error) {
            console.error("Error fetching problem:", error);
            showNotification({
                title: "Error",
                message: "Could not load problem",
                color: "red"
            });
        } finally {
            setLoading(false);
        }
    };
    if (pid) {
        fetchProblem();
    }
  }, [pid]);


  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
    editor = ref;
  };

  const changeLanguage = (value: string | null) => {
    setLanguage(value);
    // @ts-ignore
    setValue(CODE_SNIPPETS[value]);
  };

  const openModal = () =>
    modals.open({
      title: "Editor Settings",
      children: <Settings setOptions={setOptions} options={options} />,
      // labels: { confirm: "Confirm", cancel: "Cancel" },
      // onCancel: () => console.log("Cancel"),
      // onConfirm: () => console.log("Confirmed"),
    });

  const langIdMap: { [key: string]: number } = {
      python: 71,
      java: 62,
      cpp: 54
  };

  const fetchSubmissions = async () => {
      if (!problem) return;
      const jwt = localStorage.getItem("jwt");
      if (!jwt) return;

      setLoadingSubmissions(true);
      try {
          const response = await axios.get(
              `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_VERSION}/submissions/problem/${problem.dbId}`,
              { headers: { Authorization: `Bearer ${jwt}` } }
          );
          setSubmissions(response.data);
      } catch (error) {
          console.error("Error fetching submissions:", error);
      } finally {
          setLoadingSubmissions(false);
      }
  };

  const handleRun = async () => {
      if (!problem) return;
      setIsRunning(true);
      setRunResult(null);

      try {
          const response = await axios.post(
              `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_VERSION}/submissions/run`,
              {
                  sourceCode: value,
                  languageId: langIdMap[language || "python"],
                  problemId: problem.dbId
              }
          );
          const result = response.data;
          setRunResult(result);
          showNotification({
              title: "Run Result",
              message: result.status?.description || "Completed",
              color: result.passed ? "green" : "red"
          });
      } catch (error) {
          console.error("Error running code:", error);
          showNotification({ title: "Error", message: "Failed to run code", color: "red" });
      } finally {
          setIsRunning(false);
      }
  };

  const handleSubmit = async () => {
      if (!problem) return;

      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
          showNotification({ title: "Auth Required", message: "Please login to submit", color: "yellow" });
          return;
      }

      setIsSubmitting(true);
      setRunResult(null);

      try {
          const response = await axios.post(
              `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_API_VERSION}/submissions/submit`,
              {
                  sourceCode: value,
                  languageId: langIdMap[language || "python"],
                  problemId: problem.dbId
              },
              {
                  headers: { Authorization: `Bearer ${jwt}` }
              }
          );
          const result = response.data;
          setRunResult(result);
          showNotification({
              title: "Submit Result",
              message: `${result.status?.description} (${result.passedCount}/${result.totalCount} test cases)`,
              color: result.passed ? "green" : "red"
          });
          // Refresh submissions list
          fetchSubmissions();
      } catch (error) {
          console.error("Error submitting code:", error);
          showNotification({ title: "Error", message: "Failed to submit code", color: "red" });
      } finally {
          setIsSubmitting(false);
      }
  };

  const getLanguageName = (langId: number) => {
      switch (langId) {
          case 71: return "Python";
          case 62: return "Java";
          case 54: return "C++";
          default: return "Unknown";
      }
  };

  return (
    <Container fluid h={"100vh"} mx={0}>
      <Header isWorkspace={true} />
      <Split className="split" minSize={300} style={{ height: "92vh" }}>
        <div>
          <Split
            // className="split"
            direction="vertical"
            style={{ height: "90%" }}
          >
            <div style={{ overflowY: "scroll" }}>
              <Tabs defaultValue="description" w={"100%"} onChange={(value) => value === "submissions" && fetchSubmissions()}>
                <Tabs.List h={"4.5rem"}>
                  <Tabs.Tab value="description">Description</Tabs.Tab>
                  <Tabs.Tab value="solution">Solution</Tabs.Tab>
                  <Tabs.Tab value="submissions">Submissions</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="description">
                  <ProblemDescription problem={problem} loading={loading} />
                </Tabs.Panel>
                <Tabs.Panel value="solution">
                  <Text p="md" c="dimmed">Solutions coming soon...</Text>
                </Tabs.Panel>
                <Tabs.Panel value="submissions">
                  <Stack p="md" gap="sm">
                    {loadingSubmissions ? (
                      <Loader size="sm" />
                    ) : submissions.length === 0 ? (
                      <Text c="dimmed">No submissions yet. Submit your solution to see it here.</Text>
                    ) : (
                      submissions.map((sub) => (
                        <Group key={sub.id} justify="space-between" p="sm" style={{ backgroundColor: "var(--mantine-color-dark-6)", borderRadius: "4px" }}>
                          <Stack gap={2}>
                            <Group gap="xs">
                              <Badge color={sub.status === "Accepted" ? "green" : "red"} size="sm">
                                {sub.status}
                              </Badge>
                              <Text size="sm">{getLanguageName(sub.languageId)}</Text>
                            </Group>
                            <Text size="xs" c="dimmed">
                              {new Date(sub.createdAt).toLocaleString()}
                            </Text>
                          </Stack>
                          <Stack gap={2} align="flex-end">
                            <Text size="xs">Runtime: {sub.runTime.toFixed(3)}s</Text>
                            <Text size="xs">Memory: {(sub.memory / 1024).toFixed(2)} MB</Text>
                          </Stack>
                        </Group>
                      ))
                    )}
                  </Stack>
                </Tabs.Panel>
              </Tabs>
            </div>
            <div style={{ overflowY: "scroll", padding: "0.5rem" }}>
              <Title order={6} mb="sm">
                {isRunning || isSubmitting ? "Running..." : "Test Results"}
              </Title>
              
              {(isRunning || isSubmitting) && <Loader size="sm" />}
              
              {!isRunning && !isSubmitting && runResult && (
                <Stack gap="sm">
                  <Group gap="xs">
                    <Badge color={runResult.passed ? "green" : "red"} size="lg">
                      {runResult.status?.description || "Unknown"}
                    </Badge>
                    {runResult.totalCount !== undefined && (
                      <Text size="sm">
                        {runResult.passedCount}/{runResult.totalCount} test cases passed
                      </Text>
                    )}
                  </Group>

                  {/* Single test case result (from /run) */}
                  {runResult.input !== undefined && !runResult.testCaseResults && (
                    <Stack gap="xs">
                      <Code block>
                        <Text size="xs" fw={600}>Input:</Text>
                        <Text size="sm">{runResult.input || "(empty)"}</Text>
                      </Code>
                      <Code block>
                        <Text size="xs" fw={600}>Your Output:</Text>
                        <Text size="sm">{runResult.actualOutput || runResult.stdout || "(empty)"}</Text>
                      </Code>
                      <Code block>
                        <Text size="xs" fw={600}>Expected Output:</Text>
                        <Text size="sm">{runResult.expectedOutput || "(empty)"}</Text>
                      </Code>
                      {(runResult.stderr || runResult.compileOutput) && (
                        <Code block color="red">
                          <Text size="xs" fw={600}>Error:</Text>
                          <Text size="sm">{runResult.stderr || runResult.compileOutput}</Text>
                        </Code>
                      )}
                    </Stack>
                  )}

                  {/* Multiple test case results (from /submit) */}
                  {runResult.testCaseResults && (
                    <Stack gap="xs">
                      {runResult.testCaseResults.map((tc) => (
                        <Stack key={tc.testCaseNumber} gap={4} p="xs" style={{ backgroundColor: tc.passed ? "var(--mantine-color-green-9)" : "var(--mantine-color-red-9)", borderRadius: "4px", opacity: 0.9 }}>
                          <Group gap="xs">
                            <Badge color={tc.passed ? "green" : "red"} size="xs">
                              Test {tc.testCaseNumber}
                            </Badge>
                            <Text size="xs">{tc.passed ? "Passed" : "Failed"}</Text>
                          </Group>
                          {!tc.passed && (
                            <>
                              <Text size="xs">Input: {tc.input || "(empty)"}</Text>
                              <Text size="xs">Expected: {tc.expectedOutput || "(empty)"}</Text>
                              <Text size="xs">Got: {tc.actualOutput || "(empty)"}</Text>
                              {tc.errorMessage && <Text size="xs" c="red">Error: {tc.errorMessage}</Text>}
                            </>
                          )}
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Stack>
              )}

              {!isRunning && !isSubmitting && !runResult && (
                <Text size="sm" c="dimmed">Run or submit your code to see results here.</Text>
              )}
            </div>
          </Split>
          <Group justify="end" m={"md"}>
            <Button variant="light" color={"greenColor.4"} onClick={handleRun} loading={isRunning} disabled={isSubmitting}>
              Run
            </Button>
            <Button variant="filled" color={"greenColor.8"} onClick={handleSubmit} loading={isSubmitting} disabled={isRunning}>
              Submit
            </Button>
          </Group>
        </div>
        <div>
          <Group justify="end" align="center" mb={"xs"}>
            <Select
              label="Select Language"
              placeholder="Pick value"
              checkIconPosition="right"
              onChange={changeLanguage}
              data={LANGUAGES}
              defaultValue={language}
            />
            <IoSettingsOutline
              size={"1.5rem"}
              onClick={openModal}
              style={{ cursor: "pointer" }}
            />
            {/* <Select
              label="Your favorite library"
              placeholder="Pick value"
              checkIconPosition="right"
              onChange={changeLanguage}
              data={LANGUAGES}
              defaultValue={language}
            /> */}
            <AiOutlineFullscreen
              size={"1.5rem"}
              onClick={toggle}
              style={{ cursor: "pointer" }}
            />
            {/* <AiOutlineFullscreenExit /> */}
          </Group>
          <Editor
            options={options}
            theme={options.theme}
            onMount={onMount}
            height={"90%"}
            // @ts-ignore
            language={language}
            onChange={(value) => setValue(value)}
            value={value}
          />
        </div>
      </Split>
    </Container>
  );
};

export default Workspace;
