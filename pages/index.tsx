import { Button } from "@material-ui/core";
import styled from "styled-components";

const Home: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <Button className="centerButton" variant="contained">
        Button
      </Button>
    </div>
  );
};

const StyledHome = styled(Home)`
  height: 100vh;
  background-color: black;

  & > .centerButton {
    width: 200px;
    height: 200px;
    margin: 100px 100px;
  }
`;

export default StyledHome;
