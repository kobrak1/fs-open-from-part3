const Persons = ({ persons, filtered, removePerson }) => {
    const filteredPersons = persons.filter((person) =>
      person.name.toLowerCase().includes(filtered.toLowerCase())
    );
    return (
      <ul style={{ listStyleType: "none" }}>
        {filteredPersons.map((e) => (
          <li key={e.id}>
            {e.name} {e.number}
            <button onClick={() => removePerson(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
    );
  };

  export default Persons