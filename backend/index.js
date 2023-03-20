// Серверная часть
const express = require('express');
const cors = require('cors');

// БД
const pool = require('./db');

// Сессии
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

// Всякие полезности
const { v4: uuidv4 } = require('uuid');
const isValidPass = (currPass) => {
  // Здесь можно запилить политики для того, чтобы заставлять пользователей использовать надежные пароли
  // (длина пароля, наличие верхнего и нижнего регистров и т.д)
  // может сделаю, а может и не сделаю....
  return true;
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
	store: new pgSession({
		pool : pool,
		createTableIfMissing: true,
	}),
	secret : 'secret',
	resave : true,
	saveUninitialized : true,
	cookie : {
		maxAge : 1000 * 60 * 60 * 24,
		secure : false,
		httpOnly : false
	}
	
}
));

/*
--------------ЭНДПОЙНТЫ--------------
*/

// Аутентификация
app.post('/login', async (req, res) => {
	try {
		let sessionData = req.session;
		const {email, pass} = req.body;

		const queryResponse = await pool.query(
			"SELECT userid, email FROM users WHERE email = $1 AND pass = crypt($2, pass);",
			[email, pass]
		);


		if (queryResponse.rows.length === 0) {
			res.json({
			success : false
			})
		}
		else {
			sessionData.user_id = queryResponse.rows[0].userid;
			console.log(sessionData.user_id);
			res.json({
				success : true,
				email : queryResponse.rows[0].email,
				userid : queryResponse.rows[0].userid,
				sessionData : sessionData
			})            
		}
	}
	catch (error) {
		console.error(error.message)
	}
});

app.post('/signup', async (req, res) => {
	try {
		const {email, pass, passConfirm} = req.body;
		if (pass === passConfirm && isValidPass(pass)){
			const queryResponse = await pool.query(
				"INSERT INTO users (email, pass, userid) VALUES ($1, crypt($2, gen_salt('bf')), $3);",
				[email, pass, uuidv4()]
			);

			res.json({
					success : true,
					error : null
			})
		}
		else {
			if (pass !== passConfirm && !isValidPass(pass)){
				res.json({
					success : false,
					error : "Passwords Don't Match Nor Are Valid"
			})
		}
			else if (!isValidPass(pass)) {
				res.json({
					success : false,
					error : "Passwords Not Valid"
			})
		}
			else {
				res.json({
					success : false,
					error : "Passwords Don't Match"
			})
		}
	}
}

	catch (error) {
		console.error(error.message)
	}
});

app.delete('/logout', function(req, res) {
	req.session.destroy((err) => {
		 if(err){
				console.log(err);
		 }
		 else{
				 req.destroy();
		 }
	});
});

// TODO: Реализация CRUD для задач
app.post('/tasks', async (req, res) => {
    try {
        const {taskTitle, taskId, completed, parentId} = req.body;

        const newTask = await pool.query(
            "INSERT INTO task (taskId, taskTitle, completed, parentId) VALUES($1, $2, $3, $4) RETURNING *",
            [taskId, taskTitle, completed, parentId]
        );
        
        res.json(newTask.rows[0]);
    }
    catch (error) {
      console.error(error.message)
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const allTasks = await pool.query(
            "SELECT * FROM Task ORDER BY order"
        )
        res.json(allTasks.rows);
    } 
    catch (error) {
      console.error(error.message)  
    }
});

app.get("/tasks/:target", async (req, res) => {
    try {
        const { target } = req.params;

        const task = await pool.query(
            "SELECT * FROM task WHERE taskId = $1", 
            [target]
        );
        
            res.json(task.rows[0]);
    } 
    
    catch (error) {
      console.error(error.message)  
    }
});

app.put("/tasks/:target", async (req, res) => {
    try {
        const {target} = req.params;
        const {taskTitle} = req.body;

        const updateTask = await pool.query(
            "UPDATE task SET taskTitle = $1 WHERE taskId = $2",
            [taskTitle, target]
        );
        res.json("Todo updated")
    }
    catch (error) {
        console.error(error);    
    }
});

app.put("/tasks/completed/:target", async (req, res) => {
    try {
        const {target} = req.params;

        const updateTask = await pool.query(
            "UPDATE task SET completed = NOT completed WHERE taskId = $1",
            [target]
        );
        res.json("Todo updated")
    }
    catch (error) {
        console.error(error);    
    }
});

app.delete("/tasks/:target", async (req, res) => {
    try {
        const {target} = req.params;

        const deleteTask = await pool.query(
            "DELETE FROM task WHERE taskId = $1",
            [target]
        );
        res.json("Todo deleted");
    }
    catch (error) {
        console.error(error);    
    }
});

// Реализация CRUD для карточек
app.post('/cards', async (req, res) => {
    try {
        const {cardTitle, cardId, userId} = req.body;

        const newCard = await pool.query(
            "INSERT INTO card (cardId, cardTitle, userId) VALUES($1, $2, $3) RETURNING *",
            [cardId, cardTitle, userId]
        );
        
        res.json(newCard.rows[0]);
    }
    catch (error) {
      console.error(error.message)
    }
});

app.get('/cards/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const allCards = await pool.query(
            "SELECT * FROM card WHERE userId = $1 ORDER BY order", 
			[userId]
        )
        res.json(allCards.rows);
    } 
    catch (error) {
      console.error(error.message)  
    }
});

app.get("/cards/:target", async (req, res) => {
    try {
        const { target } = req.params;

        const card = await pool.query(
            "SELECT * FROM card WHERE cardId = $1", 
            [target]
        );
        
        res.json(card.rows[0]);
    } 
    
    catch (error) {
      console.error(error.message)  
    }
});

app.put("/cards/:target", async (req, res) => {
    try {
        const {target} = req.params;
        const {cardTitle} = req.body;

        const updateTask = await pool.query(
            "UPDATE card SET cardTitle = $1 WHERE cardId = $2",
            [cardTitle, target]
        );
        res.json("Card updated");
        console.log(req.body);
    }
    catch (error) {
        console.error(error);    
    }
});

app.delete("/cards/:target", async (req, res) => {
    try {
        const {target} = req.params;

        const deleteCard = await pool.query(
            "DELETE FROM Card WHERE cardId = $1",
            [target]
        );
        const allTasks = await pool.query(
            "DELETE FROM Task WHERE parentId = $1",
            [target]
        );
        res.json("Card deleted");
    }
    catch (error) {
        console.error(error);    
    }
});


app.listen(5000, () => {
  console.log("Server has started");
});