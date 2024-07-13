import PropTypes from "prop-types";

const TableDataColumn = ({ label }) => (
  <span className="font-exo-2">{label}</span>
);

TableDataColumn.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TableDataColumn;
