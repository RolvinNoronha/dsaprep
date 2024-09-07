import { Button, Group, Text } from "@mantine/core";
import React from "react";
import { BsArrowLeftSquareFill, BsArrowRightSquareFill } from "react-icons/bs";
import { FaListUl, FaRegUserCircle } from "react-icons/fa";
import { IoRocket } from "react-icons/io5";
// import { MdOutlineTimer } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Timer from "./Timer";

type HeaderPropsType = {
  isWorkspace: boolean;
};

const Header: React.FC<HeaderPropsType> = ({ isWorkspace }) => {
  const navigate = useNavigate();
  return (
    <header className="site-header">
      <div className="site-identity">
        <h1>
          <IoRocket size={"1.5rem"} />
          <a href="#">DSA PreP</a>
        </h1>
        {/* <Group justify="center">
          <HoverCard width={280} shadow="md">
            <HoverCard.Target>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm">johnDoe@email.com</Text>
            </HoverCard.Dropdown>
          </HoverCard>
        </Group> */}
        {isWorkspace ? (
          <Group justify="center">
            <BsArrowLeftSquareFill size={"1.6rem"} />
            <FaListUl size={"1rem"} />
            <Text ml={-12}>Problem List</Text>
            <BsArrowRightSquareFill size={"1.6rem"} />
          </Group>
        ) : null}
        <Group>
          {isWorkspace ? <Timer /> : null}
          <FaRegUserCircle size={"1.6rem"} />
          <Button
            onClick={() => navigate("/auth")}
            type="submit"
            // mt="sm"
            // size="sm"
            color="greenColor.8"
          >
            Sign In
          </Button>
        </Group>
      </div>
    </header>
  );
};

export default Header;
