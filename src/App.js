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
import Register from './register.js';
import Dashboard from './Dashboard.js';
import Calendar from './calendar.js';
import My_calendar from './my_calendar.js';
import Requests from './requests.js';
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
                  <NavLink className={classes_default.navLink} activeClassName="active" to="/calendar" color="inherit">
                    
                      Calendrier
                    
                  </NavLink>
                </ListItem>
                <ListItem className={classes_default.listItem}>
                  <NavLink className={classes_default.navLink} activeClassName="active" to="/requests" color="inherit">
                    
                      Requests
                    
                  </NavLink>
                </ListItem>
                <ListItem className={classes_default.listItem}>
                  <NavLink className={classes_default.navLink} activeClassName="active" to="/my_calendar" color="inherit">
                    
                      Mon calendrier
                    
                  </NavLink>
                </ListItem>
              </List>
            }
            rightLinks= {getToken() ? (
                <ListItem className={classes_default.listItem}>
                  <AccountCircle className={classes_default.icons} /> Profile
                </ListItem>
              ) : (
                <ListItem className={classes_default.listItem}>
                  <NavLink className={classes_default.navLink} activeClassName="active" to="/login" color="inherit">
                      Se connecter / S'inscrire
                    </NavLink>
                  </ListItem>
              )
            }
          />
          <div className="content">
            <Switch>
              <Route exact path="/" component={Home} />
              <PublicRoute path="/login" component={Login} />
              <PublicRoute path="/register" component={Register} />
              <PrivateRoute path="/calendar" component={Calendar} />
              <PrivateRoute path="/my_calendar" component={My_calendar} />
              <PrivateRoute path="/requests" component={Requests} />
              <PrivateRoute path="/profile" component={Profile} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}
 
export default App;