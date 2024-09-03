import { Button } from "@mantine/core";
import React from "react";
import { IoRocket } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="site-header">
      <div className="site-identity">
        <h1>
          <IoRocket size={"1.5rem"} />
          <a href="#">DSA PreP</a>
        </h1>
        <Button
          onClick={() => navigate("/auth")}
          type="submit"
          // mt="sm"
          // size="sm"
          color="greenColor.8"
        >
          Sign In
        </Button>
      </div>
    </header>
  );
};

export default Header;
