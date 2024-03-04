const PersonForm = ({
    handlePerson,
    newName,
    setNewName,
    newNumber,
    setNewNumber,
  }) => {
    return (
      <form onSubmit={handlePerson}>
        <div>
          Name:{" "}
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
        </div>
        <div>
          Number:{" "}
          <input
            type="tel"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            minLength={4}
            maxLength={15}
            required
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    );
  };

  export default PersonForm