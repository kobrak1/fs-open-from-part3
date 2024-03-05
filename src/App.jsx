/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import PersonsService from "./services/PersonsService";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import Notification from "./components/Notification"
import Persons from "./components/Persons"
import "./index.css";


const App = () => {
  // state hooks
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filtered, setFiltered] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // effect hooks
  useEffect(() => {
    console.log("effect");
    PersonsService.getAll().then((response) => {
      console.log("promise fullfilled");
      setPersons(response.data);
      console.log('people info are set')
    });
  }, []);



  // POST a new person
  const addPerson = (newObject) => {
    PersonsService.create(newObject)        
    .then((response) => response && PersonsService.getAll())
    .then((response) => {
      setPersons(response.data) // set the updated state
      console.log('person saved', response);
      // clear the input fields
      setNewName("")
      setNewNumber("")
    })
    .catch((error) => {
      console.log("Error while posting:", error.message);
      setErrorMessage(`Error: ${error.message}`)
      setTimeout(() => setErrorMessage(null), 3000)
    })
  }
  
  // UPDATE a person
  const updatePerson = (id, newObject) => {
    PersonsService.update(id, newObject)
      .then(() => PersonsService.getAll())
      .then(response => {
        setPersons(response.data) // set the updated state
        console.log('person updated')
        // clear the input fields
        setNewName("")
        setNewNumber("")
      })
      .catch(error => {
        console.log("Error while updating:", error.message)
        setErrorMessage(`Error: ${error.message}`)
        setTimeout(() => setErrorMessage(null), 3000)
      })
  }

  // handle the process of adding and updating contacts
  const handlePerson = (e) => {
    e.preventDefault();
    console.log("button is clicked", e.target);

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    // check if the person exist
    const PersonExist = persons.find(p => p.name === newName)
    const isPersonExist = Boolean(PersonExist)
    isPersonExist
      ? updatePerson(PersonExist.id, newPerson)
      : addPerson(newPerson)
  };



  // DELETE the specified person on the list
  const removePerson = (id) => {
    const removedPerson = persons.find((user) => user.id === id);
    if (
      window.confirm(
        `Are you sure you want to delete ${removedPerson.name} permanently?`
      )
    ) {
      PersonsService.remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          console.log("person has been removed");
          setSuccessMessage(
            `${removedPerson.name} has been removed successfully`
          );
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3000);
        })
        .catch((error) => {
          setErrorMessage(
            `Error while removing ${removedPerson.name}: ${error.message}`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 3000);
        });
    }
  };
  
  return (
    <div>
      <h1>Phonebook</h1>
      <Filter filtered={filtered} setFiltered={setFiltered} />
      <h2>Add New</h2>
      <Notification
        errorMessage={errorMessage}
        successMessage={successMessage}
      />
      <PersonForm
        handlePerson={handlePerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filtered={filtered}
        removePerson={removePerson}
      />
    </div>
  );
};

export default App;
