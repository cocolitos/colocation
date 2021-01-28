import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, NavLink } from 'react-router-dom';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Header from "components/Header/Header.js";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute'; 
import { getToken, removeUserSession, setUserSession } from './Utils/Common';

import Login from './Login.js';
import Dashboard from './Dashboard.js';
import Home from './Home.js';
import Profile from './Profile.js';

import styles from "assets/jss/material-kit-react/views/componentsSections/navbarsStyle.js";

const useStyles_default = makeStyles(styles);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


function App() {
  const [authLoading, setAuthLoading] = useState(true);
  const classes = useStyles();
  const classes_default = useStyles_default();
  
  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }
 
    axios.get(`https://api-sgetas.herokuapp.com/auth/verifyToken?token=${token}`).then(response => {
      //setUserSession(response.data.token, response.data.user);
      setAuthLoading(false);
    }).catch(error => {
      removeUserSession();
      setAuthLoading(false);
    });
  }, []);
 
  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>
  }

  return (
    <div className="App">
      <BrowserRouter>
        <div>
        <Header
            brand="ColinQuation"
            color="dark"
            leftLinks={
              <List className={classes_default.list}>
                <ListItem className={classes_default.listItem}>
                  <NavLink className={classes_default.navLink} activeClassName="active" to="/dashboard" color="inherit">
                    
                      Calendrier
                    
                  </NavLink>
                </ListItem>
              </List>
            }
            rightLinks= {getToken() ? (
                <ListItem className={classes_default.listItem}>
                  <NavLink className={classes_default.navLink} activeClassName="active" to="/profile" color="inherit">
                      <AccountCircle className={classes_default.icons} /> Profile
                    </NavLink>
                  </ListItem>
              ) : (
                <ListItem className={classes_default.listItem}>
                  <NavLink className={classes_default.navLink} activeClassName="active" to="/login" color="inherit">
                      Se connecter
                    </NavLink>
                  </ListItem>
              )
            }
          />
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <PublicRoute path="/login" component={Login} />
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute path="/profile" component={Profile} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}
 
export default App;