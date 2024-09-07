import { Container, Group, Select, Tabs } from "@mantine/core";
import React, { useRef, useState } from "react";
import Header from "../components/Header/Header";
import { Editor } from "@monaco-editor/react";
import { CODE_SNIPPETS, LANGUAGES } from "../utils/constants";
import Split from "react-split";
import { AiOutlineFullscreen } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import ProblemDescription from "../components/Workspace/ProblemDescription";
// import { MdOutlineDescription } from "react-icons/md";
import { useFullscreen } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import Settings from "../components/Workspace/Settings";

const Workspace: React.FC = () => {
  const editorRef = useRef<any | undefined>();
  const [language, setLanguage] = useState<string | null>("python");
  const [value, setValue] = useState<string | undefined>(
    // @ts-ignore
    CODE_SNIPPETS[language]
  );

  const { ref, toggle } = useFullscreen();

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
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: <Settings />,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => console.log("Confirmed"),
    });

  return (
    <Container fluid h={"100vh"} mx={0}>
      <Header isWorkspace={true} />
      <Split className="split" minSize={300} style={{ height: "92vh" }}>
        <div>
          <Split
            // className="split"
            direction="vertical"
            style={{ height: "100%" }}
          >
            <div style={{ overflowY: "scroll" }}>
              <Tabs defaultValue="description" w={"100%"}>
                <Tabs.List h={"4.5rem"}>
                  <Tabs.Tab value="description">Description</Tabs.Tab>
                  <Tabs.Tab value="solution">Solution</Tabs.Tab>
                  <Tabs.Tab value="submissions">Submissions</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="description">
                  <ProblemDescription />
                </Tabs.Panel>
                <Tabs.Panel value="solution">Solutions</Tabs.Panel>
                <Tabs.Panel value="submissions">Submissions</Tabs.Panel>
              </Tabs>
            </div>
            <div style={{ overflowY: "scroll" }}></div>
          </Split>
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
            onMount={onMount}
            height={"90%"}
            theme="vs-dark"
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
