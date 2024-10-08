import { Button, Container, Group, Select, Stack, Title } from "@mantine/core";
import React, { Dispatch, SetStateAction } from "react";
import { OptionsType } from "../../pages/Workspace";
import { modals } from "@mantine/modals";
// import { useMonaco } from "@monaco-editor/react";

type SettingsPropsType = {
  setOptions: Dispatch<SetStateAction<OptionsType>>;
  options: OptionsType;
};

const Settings: React.FC<SettingsPropsType> = ({ setOptions, options }) => {
  // const monaco = useMonaco();
  // useEffect(() => {
  //   if (monaco) {
  //     import(`monaco-themes/themes/Monokai Bright.json`)
  //       // @ts-ignore
  //       .then((data) => monaco.editor.defineTheme("monokai-bright", data))
  //       .then((_) => monaco.editor.setTheme("monokai-bright"));
  //     // monaco.editor.defineTheme("monokai-bright").then(_ => monaco.editor.setMonacoTheme("monokai-bright"));
  //   }
  // }, [options]);
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
            defaultValue={options.fontSize.toString()}
            onChange={(value) =>
              setOptions((prevOptions) => ({
                ...prevOptions,
                fontSize: Number(value) ?? 12,
              }))
            }
          />
        </Group>
        <Group justify="space-between">
          <Title order={5}>Font Family: </Title>
          <Select
            onChange={(value) =>
              setOptions((prevOptions) => ({
                ...prevOptions,
                fontFamily: value ?? "Consolas",
              }))
            }
            label="Select font family"
            //   placeholder="P"
            checkIconPosition="right"
            //   onChange={changeLanguage}
            data={[
              "Consolas",
              "Courier New",
              // "Monospace",
              // "Hasklig",
              // "Fira Code",
            ]}
            defaultValue={options.fontFamily}
          />
        </Group>
        <Group justify="space-between" mb={"lg"}>
          <Title order={5}>Editor Theme: </Title>
          <Select
            onChange={(value) =>
              setOptions((prevOptions) => ({
                ...prevOptions,
                theme: value ?? "vs-dark",
              }))
            }
            label="Select theme"
            //   placeholder="P"
            checkIconPosition="right"
            //   onChange={changeLanguage}

            data={["vs-dark", "cobalt"]}
            defaultValue={options.theme}
          />
        </Group>
        {/* <Group justify="space-between" mb={"lg"}>
          <Title order={5}>Tab Size: </Title>
          <Select
            onChange={(value) =>
              setOptions((prevOptions) => ({
                ...prevOptions,
                tabSize: Number(value) ?? 4,
              }))
            }
            label="Select tab size"
            //   placeholder="P"
            checkIconPosition="right"
            //   onChange={changeLanguage}
            data={["2", "4"]}
            defaultValue={options.tabSize.toString()}
          />
        </Group> */}
        <Button onClick={() => modals.closeAll()} mt="md">
          OK
        </Button>
      </Stack>
    </Container>
  );
};

export default Settings;
