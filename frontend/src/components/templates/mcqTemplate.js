import { Radio, Flex } from "antd";
const mcqTemplate = () => {
    return (
        <div className="multipleChoiceTemplate">
            <Flex vertical gap="middle">
            <Radio.Group defaultValue="a" size="large">
                <Radio.Button value="a">Hangzhou</Radio.Button>
                <Radio.Button value="b">Shanghai</Radio.Button>
                <Radio.Button value="c">Beijing</Radio.Button>
                <Radio.Button value="d">Chengdu</Radio.Button>
            </Radio.Group>
            </Flex>
        </div>
    );
};

export default mcqTemplate;