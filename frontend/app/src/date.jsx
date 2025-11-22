import dayjs from "dayjs";

const Datepick = ({ label, value, setValue }) => {
  const handleChange = (e) => {
    const newValue = e.target.value ? dayjs(e.target.value) : dayjs();
    setValue(newValue);
  };

  return (
    <div className="date-input-wrapper">
      <label>{label}</label>
      <input
        type="datetime-local"
        value={value ? value.format("YYYY-MM-DDTHH:mm") : ""}
        onChange={handleChange}
      />
    </div>
  );
};

export default Datepick;
