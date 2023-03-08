// Серверная часть
const express = require('express');
const cors = require('cors');

// TODO: Потихоньку прикручивать БД
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

// TODO: Реализация CRUD для карточек

app.listen(5000, () => {
  console.log("Server has started");
});