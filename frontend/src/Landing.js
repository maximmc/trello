import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";

import { UserContext } from './userContext';
import { AuthContext } from './authContext';

import './App.css';
import './landing.css';

const isValidPass = (currPass) => {
    return true;
}

const modalStyles = {
    content : {
        width                 : '30%',
        height                 : '55%',
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        display : "flex",
        flexDirection : "column",
        alignItems : "center"
      }
}

Modal.setAppElement('#root')

export default function Landing() {
    const navigate = useNavigate();

    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPass, setSignUpPass] = useState('');
    const [signUpPassConf, setSignUpPassConf] = useState('');

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPass, setLoginPass] = useState('');

    const [modalOpen, setModalOpen] = useState(false);

    const [signUpSent, setSignUpSent] = useState(false);
    const [accountMade,  setAccountMade] = useState(false); 
    const [passesMatchFrontend, setPassesMatchFrontend] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);
    const [validPass, setValidPass] = useState(false);
    const [errorMsgSignup, setErrorMsgSignup] = useState('');    


    const {userId, setUserId} = useContext(UserContext);
    const {authed, setAuthed} = useContext(AuthContext);

    const closeModal = () => {
        setModalOpen(false);
        setAccountMade(false);
        setSignUpSent(false);

        setPassesMatchFrontend(false);
        setValidPass(false);
        setErrorMsgSignup('');

        setSignUpPass('');
        setSignUpPassConf('');
    }

    useEffect(() => {
        if(authed){
            navigate("/home");
        }
    }
    ,[]);

    const HandleSignUp = (e) => {
        e.preventDefault();
        fetch(`/signup`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email : signUpEmail,
                pass : signUpPass,
                passConfirm : signUpPassConf
            })
          })
          .then(res => res.json())
          .then(data => {
            setSignUpSent(true);
            if (data.success){
                setAccountMade(true);
            }
            else {
                setAccountMade(false);
                setErrorMsgSignup(data.error);
            }
          });
    }
    
    const HandleLogin = (e) => {
        e.preventDefault();
        fetch(`/login`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email : loginEmail,
                pass : loginPass
            })
          }).then(res => res.json())
          .then(data => {
              if (data.success){
                setAuthed(true);
                setUserId(data.userid);
                localStorage.setItem('rememberMe', true);
                localStorage.setItem('userId', data.userid)
                navigate("/home");
              }
              else{
                  setLoginFailed(true)
              }
          });
    }

    return (
        <div className="main-container">
            <Modal
                isOpen={modalOpen}
                onRequestClose={closeModal}
                style={modalStyles}
                contentLabel="Example Modal"
                >
                <h1 style={{textAlign: 'center', fontSize: '1.5rem'}}>Зарегистрироваться в Trello</h1>
                <form action="" className="sign-up" onSubmit={(event) => HandleSignUp(event)}>
                    <input type="email" placeholder="Имя пользователя" onChange={event => setSignUpEmail(event.target.value)}/>
                    <input 
                        type="password"
                        placeholder="Пароль"
                        style={validPass ? {borderBottom: '1px solid green'} : {borderBottom: '1px solid red'}}
                        onChange={event => {
                            setSignUpPass(event.target.value);
                            isValidPass(event.target.value) ? setValidPass(true) : setValidPass(false);
                        }}/>
                    <input
                        type="password"
                        placeholder="Подтверждение пароля"
                        style={passesMatchFrontend ? {borderBottom: '1px solid green'} : {borderBottom: '1px solid red'}} 
                        onChange={event => {
                            setSignUpPassConf(event.target.value);

                            if(event.target.value === signUpPass){
                                setPassesMatchFrontend(true);
                            }
                            else {
                                setPassesMatchFrontend(false);
                            }
                        }
                    }/>
                    <button className="button sign-up-btn">Зарегистрироваться</button>
                </form>

                {signUpSent && !accountMade
                    ?
                    <p style={{color: 'red', margin: '.25rem 0'}}>{errorMsgSignup}</p>
                    :
                    <div style={{display: 'none'}}></div>
                }
                {signUpSent && accountMade
                    ?
                    <p style={{color: 'green', margin: '0'}}>Регистрация прошла успешно. Закройте это окно нажатием кнопки Esc.</p>
                    :
                    <div style={{display: 'none'}}></div>
                }
            </Modal>


            <div className="intro">
                <h1 style={{textAlign: 'center', color: 'white', margin: '1rem 0', marginTop: '4rem', fontSize: '2.5rem'}}>Клон(Clone) Trello(Трелло)</h1>

                <h2 style={{textAlign: 'center', margin: '1rem 0', lineHeight: '1.7rem'}}>Работает.<br/>Наверное.<br/>Ну во всяком случае должно.</h2>

                <h3 style={{textAlign: 'center', width: '40%', fontWeight: '200', color: 'white', fontSize: '1.25rem', margin: '1rem 0'}}>Помогите</h3>
            </div>
            <div className="login">
                <div className="login-box">

                    <h1 className="title1">Войти</h1>

                    <form className="login-form" action="" onSubmit={(event) => HandleLogin(event)}>
                        <input type="email" placeholder="Имя пользователя" className="inputBox" onChange={event => setLoginEmail(event.target.value)}/>
                        <input type="password" placeholder="Пароль" className="inputBox" onChange={event => setLoginPass(event.target.value)}/>
                        <button className="button">Войти</button>
                    </form>

                    <p style={loginFailed ? {color: 'red', margin: '0', fontSize: '.7rem'} : {display: 'none'}}>Неверное имя пользователя или пароль</p>

                    <p className="else" onClick={() => {
                        setModalOpen(true)
                    }}>Зарегистрироваться</p>
                </div>

            </div>
        </div>
    )
}
