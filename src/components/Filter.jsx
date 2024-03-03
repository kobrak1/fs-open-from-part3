const Filter = ({ filtered, setFiltered }) => {
    return (
      <div>
        Filter by name:
        <input
          type="text"
          value={filtered}
          onChange={(e) => setFiltered(e.target.value)}
          placeholder="Search..."
        />
      </div>
    );
  };

  export default Filter