import { Form, Input } from "antd";
import clsx from "clsx";
import PropTypes from "prop-types";

const PasswordField = ({
  name,
  label,
  autoComplete,
  className,
  variant,
  placeholder,
  rules,
}) => {
  return (
    <Form.Item
      name={name}
      label={<span className="text-base">{label}</span>}
      className={clsx("password-field", className)}
      rules={rules}
    >
      <Input.Password
        autoComplete={autoComplete}
        variant={variant}
        placeholder={placeholder}
        className="text-base h-10"
      />
    </Form.Item>
  );
};

PasswordField.propTypes = {
  autoComplete: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  className: PropTypes.string,
  variant: PropTypes.string,
  placeholder: PropTypes.string,
  rules: PropTypes.array,
};

PasswordField.defaultProps = {
  label: null,
  autoComplete: "off",
  className: "",
  variant: "outlined",
  placeholder: "",
  rules: [],
};

export default PasswordField;
