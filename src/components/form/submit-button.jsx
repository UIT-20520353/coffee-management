import { Button, Form } from "antd";
import clsx from "clsx";
import PropTypes from "prop-types";

const SubmitButton = ({ text, className = "" }) => {
  return (
    <Form.Item className="w-full">
      <Button
        htmlType="submit"
        className={clsx(
          "w-full text-base bg-brown-1 hover:!bg-brown-3 duration-300 h-10 font-exo-2",
          className
        )}
        type="primary"
      >
        {text}
      </Button>
    </Form.Item>
  );
};

SubmitButton.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default SubmitButton;
