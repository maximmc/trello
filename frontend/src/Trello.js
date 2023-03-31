import React, {useState, useEffect, useContext} from 'react';
import { v4 as uuidv4 } from 'uuid';

import { UserContext } from './userContext';
import { AuthContext } from './authContext';

import Navbar from './Components/Navbar';
import Card from './Components/Card';

import './App.css';
import './Components/card.css';

function Trello({ }) {
  const [cards, setCards] = useState([]);

  const [tasks, setTasks] = useState([]);

  const {userId, setUserId} = useContext(UserContext);
  const {authed, setAuthed} = useContext(AuthContext);

  console.log(userId);
  useEffect(() => {
    fetch('http://localhost:5000/cards/'+userId)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setCards([...cards, ...data]);
    })
    }, 
  []);

  useEffect(() => {
    fetch('http://localhost:5000/tasks')
    .then(res => res.json())
    .then(data => {
      setTasks([...tasks, ...data]);
      })
    }, 
  []);

  const updateCardTitle = (cardId, newName) => {
    let edit = cards.slice();
    edit.forEach(currCard => {
      if (currCard.cardid === cardId){
        console.log(currCard.cardTitle)
        currCard.cardtitle = newName;
      }
    })
    setCards(edit);

    fetch(`http://localhost:5000/cards/${cardId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardTitle: newName
      })
    });
  }

  const addCard = () => {
    let nextCard = {
      cardtitle : `Новая карточка`,
      cardid : uuidv4(),
    };

    setCards([...cards, nextCard]);

    fetch(`/cards`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardId: nextCard.cardid,
        cardTitle: nextCard.cardtitle,
        user_id : userId
      })
    });
  }

  const deleteCard = (cardId) => {
    setTasks(tasks.filter(currTask => currTask.parentid !== cardId));
    setCards(cards.filter(currCard => currCard.cardid !== cardId));

    fetch(`/cards/${cardId}`, {
      method: 'DELETE'
      });
  }

  const updateTaskTitle = (taskId, newName) => {
    let edit = tasks.slice();
    edit.forEach(currTask => {
      if (currTask.taskid === taskId){
        currTask.tasktitle = newName
      }
    })
    setTasks(edit);

    fetch(`/${taskId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tasktitle: newName
      })
    });
  }

  const addTask = (parentCardId, addedTitle) => {
    const newTask = {
        taskid : uuidv4(),
        tasktitle : addedTitle,
        completed: false,
        parentid : parentCardId,
      };

      setTasks([...tasks, newTask]);

      fetch(`/tasks`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask)
      });
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(currTask => currTask.taskid !== taskId));

    fetch(`/tasks/${taskId}`, {
      method: 'DELETE'
      });
  }

  const strikeTask = (taskId) => {
    let edit = tasks.slice();
    edit.forEach(currTask => {
      if (currTask.taskid === taskId){
        let isStruck = currTask.completed;
        currTask.completed = !isStruck;

        fetch(`/tasks/completed/${taskId}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
      }
    })
    setTasks(edit);

  }

  return (
    <>
    <Navbar /> 
    <div className="contain">
      {/* Карточка */}
      {cards.map(currCard => (
        <Card
          key={currCard.cardid}

          cardTitle={currCard.cardtitle}
          taskList={tasks.filter(curr => curr.parentid === currCard.cardid)}
          cardId={currCard.cardid}

          updateCardTitle={updateCardTitle}
          deleteCard={deleteCard}

          updateTaskTitle={updateTaskTitle}
          addTask={addTask}
          deleteTask={deleteTask}
          strikeTask={strikeTask}
          

        />
      ))}

      {/* Новая карточка */}
      <button className="new-list" onClick={() => addCard()}>+</button>
      <div className="padding-div"></div>
      {}
      {}
    </div>
    </>
  );
}

export default Trello;