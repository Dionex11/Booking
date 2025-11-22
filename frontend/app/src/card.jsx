
const SimpleCard = ({ item, isSelected, onToggle }) => {
  return (
    <div
      onClick={() => onToggle(item.id)}
      className={`resource-card ${isSelected ? "selected" : ""}`}
    >
      {isSelected && <div className="card-badge">✓</div>}
      <h3>{item.name}</h3>
      <p>{item.info}</p>
      <div className="card-glow" />
    </div>
  );
};
export default SimpleCard