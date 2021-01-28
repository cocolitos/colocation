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

function Login(props) {
  const classes = useStyles();
  const [username, setUsername ]= useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
 
  // handle button click of login form
  const handleLogin = (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    axios.post('https://api-sgetas.herokuapp.com/auth/signin'  , {username: username, password: password }).then(response => {
      console.log(response);
      setLoading(false);
      setUserSession(response.data.accessToken, response.data);
      window.location.reload(false);
      //props.history.push('/dashboard');
    }).catch(error => {
      setLoading(false);
      console.log(error);
      if (error.response && error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    });
  }
 
  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={3}>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper} style={{ justifyContent: "center"}}>
            <form onSubmit={handleLogin}>
              <p>Nom d'utilisateur:</p>
              <input 
                type="text" 
                value={username}
                onChange={event => setUsername(event.target.value)}
                placeholder="Nom"
                required 
              />
              <p>Mot de passe</p>
              <input 
                type="password" 
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Email"
              />
              <p>
                {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
                <Button type="submit" color="primary">
                  Se conecter
                </Button>
              </p>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={3}>
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
 
export default Login;