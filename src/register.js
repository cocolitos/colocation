import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession } from './Utils/Common';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Button from "components/CustomButtons/Button.js";
import { makeStyles } from '@material-ui/core/styles';
 
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    justifyContent: "center",
    display: "flex"
  },
}));

function Register(props) {
  const classes = useStyles();
  const [loginusername, setLoginUsername ] = useState('');
  const [loginpassword, setLoginPassword] = useState('');
  const [username, setUsername ] = useState('');
  const [name, setName ] = useState('');
  const [surname, setSurname ] = useState('');
  const [email, setEmail ] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
 
  // handle button click of login form
  const handleLogin = (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    axios.post('https://cocolinquation.herokuapp.com/users/login'  , {username: loginusername, password: loginpassword }).then(response => {
      console.log(response);
      setLoading(false);
      console.log(response.data);
      setUserSession(response.data.token, response.data);
      window.location.reload(false);
      props.history.push('/calendar');
    }).catch(error => {
      setLoading(false);
      console.log("erreur");
      console.log(error);
      if (error.response && error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    });
  }

  const handleRegister = (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    axios.post('https://cocolinquation.herokuapp.com/users/register'  , {
      username: username,
      password: password,
      last_name: name,
      first_name: surname,
      email: email
    }).then(response => {
      console.log(response);
      setLoading(false);
      //setUserSession(response.data.accessToken, response.data);
      window.location.reload(false);
      props.history.push('/login');
    }).catch(error => {
      setLoading(false);
      console.log(error);
      if (error.response && error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    });
  }
 
  return (
    <div>
      <Grid container spacing={12}>
        
        <Grid container spacing={3}>
          <Grid item xs={3}>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper} style={{ justifyContent: "center"}}>
              S'inscrire
              <form onSubmit={handleRegister}>
                <p>Nom d'utilisateur:</p>
                <input 
                  type="text" 
                  value={username}
                  onChange={event => setUsername(event.target.value)}
                  placeholder="Nom utilisateur"
                  required 
                />
                <p>Prenom:</p>
                <input 
                  type="text" 
                  value={surname}
                  onChange={event => setSurname(event.target.value)}
                  placeholder="Prenom"
                  required 
                />
                <p>Nom:</p>
                <input 
                  type="text" 
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder="Nom"
                  required 
                />
                <p>Email:</p>
                <input 
                  type="text" 
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="Email"
                  required 
                />
                <p>Mot de passe</p>
                <input 
                  type="password" 
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  placeholder="Mot de passe"
                />
                <p>
                  {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
                  <Button type="submit" color="info">
                    S'enregistrer
                  </Button>
                </p> 
              </form>
            </Paper>
          </Grid>
          <Grid item xs={3}>
          </Grid>
        </Grid>
      </Grid>

    </div>
  );



}
/*      Login<br /><br />
      <div>
        Username<br />
        <input type="text" {...username} autoComplete="new-password" />
      </div>
      <div style={{ marginTop: 10 }}>
        Password<br />
        <input type="password" {...password} autoComplete="new-password" />
      </div>
      {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
      <input type="button" value={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} /><br />
    </div>*/
 
const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);
 
  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}
 
export default Register;