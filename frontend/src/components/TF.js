import { Button } from "antd";



function TrueFalse() {

    const handleTrueClick = () => {};
    const handleFalseClick = () => {};

  return (
    <>
        <Button onClick={handleTrueClick} type="primary" id="TrueButton">True</Button>
        <Button onClick={handleFalseClick}type="primary" id="FalseButton">False</Button>
    </>
  );
}

export default TrueFalse;