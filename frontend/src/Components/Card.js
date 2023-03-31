import React, {useState} from 'react';
import './card.css';
import Task from './Task';

export default function Card({
    cardTitle, taskList, cardId,
    updateCardTitle, deleteCard,
    updateTaskTitle, addTask, deleteTask, strikeTask
}) 
{
    const [newCardTitle, setNewCardTitle] = useState('');
    const [cardTitleChangeBool, setCardTitleChangeBool] = useState(false);

    const [addTaskTitle, setAddTaskTitle] = useState('')

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        if (newCardTitle === ''){
            return;
        }
        else{
           updateCardTitle(cardId, newCardTitle)
           setCardTitleChangeBool(!cardTitleChangeBool)
           setNewCardTitle('')
        }
    }

    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (addTaskTitle === ''){
            return;
        }
        else{
           addTask(cardId, addTaskTitle);
           setAddTaskTitle('');
        }
    }
    return (
        <div className="card">
            <div className="title-div">
                {cardTitleChangeBool
                    ?
                        <form action="" onSubmit={event => handleUpdateSubmit(event)}>
                            <input 
                                onChange={event => setNewCardTitle(event.target.value)}
                                className="update-title" 
                                type="text"
                                placeholder={cardTitle}
                            />
                        </form>
                    :
                        <h3 onClick={() => setCardTitleChangeBool(!cardTitleChangeBool)}>
                            {cardTitle}
                        </h3>
                }

            </div>

            {taskList.map(curr => (
                <Task 
                    key={curr.taskid}

                    taskTitle={curr.tasktitle}
                    taskId={curr.taskid}
                    taskCompleted={curr.completed}
                    parentId={cardId}

                    updateTaskTitle={updateTaskTitle}
                    deleteTask={deleteTask}
                    strikeTask={strikeTask}
                />
            ))}

            <form className="add-task" action="input" onSubmit={event => handleAddSubmit(event)}>
                {}
                <input type="text" placeholder="Добавить задачу" value={addTaskTitle} onChange={event => setAddTaskTitle(event.target.value)}/> 
                <button className="add-btn" >+</button>  
            </form>
            
            <button className="delete-card" onClick={() => deleteCard(cardId)}>Удалить</button>
        </div>
    )
}
