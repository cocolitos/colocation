import React, { useState } from 'react';
import { setUserSession, getToken, getUser, removeUserSession } from './Utils/Common';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Button from "components/CustomButtons/Button.js";
import Badge from "components/Badge/Badge.js";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import styles from "./assets/jss/material-kit-react/views/componentsSections/basicsStyle.js";
//import Button from "components/CustomButtons/Button.js";
import Slide from "@material-ui/core/Slide";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Popup from 'reactjs-popup';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

Transition.displayName = "Transition";

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

function RoleExist(user, role) {
  return user.some(function(el) {
    return el.name === role;
  }); 
}


function Profile(props) {
  const classes = useStyles();
  const classes_dialog = makeStyles(styles);
  const [isLoading, setLoading] = useState(true);
  const [userLogin, setUserLogin] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isAdmin, setAdmin] = useState(false);
  const [users, setUsers] = useState([]);

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [createUserLogin, setCreateUserLogin] = useState("");
  const [createUserEmail, setCreateUserEmail] = useState("");
  const [createUserPassword, setCreateUserPassword] = useState("");
  const [createUserId, setCreateUserId] = useState();
  const [createUserRoleUser, setCreateUserRoleUser] = useState(true);
  const [createUserRoleModerator, setCreateUserRoleModerator] = useState(false);
  const [createUserRoleAdmin, setCreateUserRoleAdmin] = useState(false);
  const [createUserUrl, setCreateUserUrl] = useState("");
  const [createUserActionCreate, setCreateUserActionCreate] = useState(true);

  const [showUpadteMyPassword, setShowUpdateMyPassword] = useState(false);

  const [showUpdatePassword, setShowUpdatePassword] = useState(false);

  if (isLoading) {
    axios.get('https://api-sgetas.herokuapp.com/user/me', {headers: {"x-access-token": getToken()} }).then(response => {
      setUserLogin(response.data.username);
      setUserEmail(response.data.email);
      response.data.roles.map((role) => {
        if (role.name == "admin") {
          setAdmin(true);
          axios.get("https://api-sgetas.herokuapp.com/user", {headers: {"x-access-token": getToken()} }).then(response => {
            setUsers(response.data);
            console.log(response.data);
            setLoading(false);
          }).catch(error => {
            console.log(error);
          });
        }
        console.log(role);
      });
      if (isAdmin == false) {
        setLoading(false);
      }
    }).catch(error => {
      console.log(error);
    });

  }

  const handleSubmit_EditMe = (event) => {

      event.preventDefault();

      let data = {
        username: userLogin,
        email: userEmail
      }
      console.log(data);
      axios.post('https://api-sgetas.herokuapp.com/user/me', data
      , {
        headers: {"x-access-token": getToken()}
      }).then(response => {
        console.log(response);
        window.location.reload(false);
        //props.history.push('/dashboard');
      }).catch(error => {
        console.log(error);
      });
      //console.log(React.findDOMNode(this.refs.equipe_nom_ref).value);
    }

    const handleSubmit_editPasswordMe = (event) => {

      event.preventDefault();

      let data = {
        password: userPassword
      }
      console.log(data);
      axios.post('https://api-sgetas.herokuapp.com/user/password/me', data
      , {
        headers: {"x-access-token": getToken()}
      }).then(response => {
        console.log(response);
        window.location.reload(false);
        //props.history.push('/dashboard');
      }).catch(error => {
        console.log(error);
      });
      //console.log(React.findDOMNode(this.refs.equipe_nom_ref).value); 
    }

    const handleSubmit_editPassword = (event) => {

      event.preventDefault();

      let data = {
        password: userPassword,
        id: createUserId
      }
      console.log(data);
      axios.post('https://api-sgetas.herokuapp.com/user/new_password', data
      , {
        headers: {"x-access-token": getToken()}
      }).then(response => {
        console.log(response);
        //window.location.reload(false);
        //props.history.push('/dashboard');
      }).catch(error => {
        console.log(error);
      });
      //console.log(React.findDOMNode(this.refs.equipe_nom_ref).value); 
    }

  const handleSubmit_createUser = (event) => {
    event.preventDefault();

    let roles = [];
    if (createUserRoleUser) {
      roles.push("user");
    }
    if (createUserRoleModerator) {
      roles.push("moderator");
    }
    if (createUserRoleAdmin) {
      roles.push("admin");
    }

    let data = {
      username: createUserLogin,
      email: createUserEmail,
      roles: roles
    };
    if (createUserActionCreate == true) {
      data.password = createUserPassword;
    } else {
      data.id = createUserId;
    }
    console.log(data);
    axios.post(createUserUrl, data
      , {
        headers: {"x-access-token": getToken()}
      }).then(response => {
        console.log(response);
        window.location.reload(false);
        //props.history.push('/dashboard');
      }).catch(error => {
        console.log("erreur");
        console.log(error.response.data.message);
      });
  }

  const updateUser = (user) => {
    if (user !== undefined) {
      setCreateUserActionCreate(false);
      setCreateUserUrl("https://api-sgetas.herokuapp.com/user/update");
      setCreateUserLogin(user.username);
      setCreateUserEmail(user.email);
      setCreateUserId(user._id);
      setCreateUserRoleUser(RoleExist(user.roles, "user"));
      setCreateUserRoleModerator(RoleExist(user.roles, "moderator"));
      setCreateUserRoleAdmin(RoleExist(user.roles, "admin"));
      setShowCreateUser(true);
    } else {
      setCreateUserActionCreate(true);
      setCreateUserUrl("https://api-sgetas.herokuapp.com/auth/signup");
      setCreateUserLogin("");
      setCreateUserEmail("");
      setCreateUserRoleUser(true);
      setCreateUserRoleModerator(false);
      setCreateUserRoleAdmin(false);
      setShowCreateUser(true);
    }
  }

  const updatePasswordUser = (user) => {
    setCreateUserId(user._id);
    setUserPassword("");
    setShowUpdatePassword(true);
  }

  const deleteUser = (id_user) => {
    axios.delete('https://api-sgetas.herokuapp.com/user/delete', {
        headers: {"x-access-token": getToken()},
        params: {id: id_user}
      }).then(response => {
      console.log(response.data);
      window.location.reload(false);
    }).catch(error => {
      console.log(error);
    });
  }

  const deconexion = () => {
    removeUserSession();
    window.location.reload(false);
  }

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }


  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={3}>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper} style={{ justifyContent: "center"}}>
            <Avatar className={classes.large}>{userLogin[0]}</Avatar>
            <form onSubmit={handleSubmit_EditMe}>
              <p>Nom d'utilisateur:</p>
              <input 
                type="text" 
                value={userLogin}
                onChange={event => setUserLogin(event.target.value)}
                placeholder="Nom"
                required 
              />
              <p>Adresse email:</p>
              <input 
                type="text" 
                value={userEmail}
                onChange={event => setUserEmail(event.target.value)}
                placeholder="Email"
              />
              <p>
                <Button type="submit" color="primary">
                  Modifier
                </Button>
                <Button
                  onClick={() => setShowUpdateMyPassword(true)}
                  color="danger"
                  simple
                >
                  Changer mot de passe
                </Button>
                <Popup trigger={<Button color="warning">Se deconnecter</Button>} position="right center">
                  <div><Button color="warning" onClick={() => deconexion()}>Se deconnecter</Button></div>
                </Popup>
              </p>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={3}>
        </Grid>
      </Grid>

      <Dialog
          classes={{
            root: classes_dialog.center,
            paper: classes_dialog.modal
          }}
          open={showUpadteMyPassword}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setShowUpdateMyPassword(false)}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={classes_dialog.modalHeader}
          >
            Modifier le mot de passe
            <IconButton
              className={classes_dialog.modalCloseButton}
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => setShowUpdateMyPassword(false)}
            >
              <Close className={classes_dialog.modalClose} />
            </IconButton>
          </DialogTitle>
          <form onSubmit={handleSubmit_editPasswordMe}>
            <DialogContent
              id="classic-modal-slide-description"
              className={classes_dialog.modalBody}
            >
              <p>Nouveau mot de passe</p>
              <input 
                type="text" 
                value={userPassword}
                onChange={event => setUserPassword(event.target.value)}
                placeholder="Nouveau mot de passe" 
                required
              />
            </DialogContent>
            <DialogActions className={classes_dialog.modalFooter}>
              <Button type="submit" color="primary">
                Valider
              </Button>
              <Button
                onClick={() => setShowUpdateMyPassword(false)}
                color="danger"
                simple
              >
                Fermer
              </Button>
            </DialogActions>
          </form>
        </Dialog>

     <Dialog
          classes={{
            root: classes_dialog.center,
            paper: classes_dialog.modal
          }}
          open={showUpdatePassword}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setShowUpdatePassword(false)}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={classes_dialog.modalHeader}
          >
            Modifier le mot de passe
            <IconButton
              className={classes_dialog.modalCloseButton}
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => setShowUpdatePassword(false)}
            >
              <Close className={classes_dialog.modalClose} />
            </IconButton>
          </DialogTitle>
          <form onSubmit={handleSubmit_editPassword}>
            <DialogContent
              id="classic-modal-slide-description"
              className={classes_dialog.modalBody}
            >
              <p>Nouveau mot de passe</p>
              <input 
                type="text" 
                value={userPassword}
                onChange={event => setUserPassword(event.target.value)}
                placeholder="Nouveau mot de passe" 
                required
              />
            </DialogContent>
            <DialogActions className={classes_dialog.modalFooter}>
              <Button type="submit" color="primary">
                Valider
              </Button>
              <Button
                onClick={() => setShowUpdatePassword(false)}
                color="danger"
                simple
              >
                Fermer
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog
          classes={{
            root: classes_dialog.center,
            paper: classes_dialog.modal
          }}
          open={showCreateUser}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setShowCreateUser(false)}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >
          <DialogTitle
            id="classic-modal-slide-title"
            disableTypography
            className={classes_dialog.modalHeader}
          >
            Ajouter un utilisateur
            <IconButton
              className={classes_dialog.modalCloseButton}
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => setShowCreateUser(false)}
            >
              <Close className={classes_dialog.modalClose} />
            </IconButton>
          </DialogTitle>
          <form onSubmit={handleSubmit_createUser}>
            <DialogContent
              id="classic-modal-slide-description"
              className={classes_dialog.modalBody}
            >
              <p>Nom d'utilisateur</p>
              <input 
                type="text"
                value={createUserLogin}
                onChange={event => setCreateUserLogin(event.target.value)}
                placeholder="Nom d'utilisateur"
                required
              />
              <p>Email</p>
              <input 
                type="text"
                value={createUserEmail}
                onChange={event => setCreateUserEmail(event.target.value)}
                placeholder="Email"
              />
              { createUserActionCreate == true ? (
                <div>
                  <p>Mot de passe</p>
                  <input 
                    type="text"
                    value={createUserPassword}
                    onChange={event => setCreateUserPassword(event.target.value)}
                    placeholder="Mot de passe"
                    required
                  />
                </div>
              ) : (
                <p></p>
              )}
              <p>Roles</p>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={createUserRoleUser}
                      onChange={event => setCreateUserRoleUser(event.target.checked)}
                      name="RoleUser"
                    />
                  }
                  label="Lire"
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={createUserRoleModerator}
                      onChange={event => setCreateUserRoleModerator(event.target.checked)}
                      name="RoleModerator"
                    />
                  }
                  label="Ecrire"
                />
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={createUserRoleAdmin}
                      onChange={event => setCreateUserRoleAdmin(event.target.checked)}
                      name="RoleAdmin"
                    />
                  }
                  label="Administrateur"
                />
              </FormGroup>
            </DialogContent>
            <DialogActions className={classes_dialog.modalFooter}>
              <Button type="submit" color="primary">
                Valider
              </Button>
              <Button
                onClick={() => setShowCreateUser(false)}
                color="danger"
                simple
              >
                Fermer
              </Button>
            </DialogActions>
          </form>
        </Dialog>


    </div>
  );
}
 
/*
  AFFICHER INFO PERSO

  si admin:

    ajouter utilisateur

    liste utilisateurs
      popup edit
      delete



*/

export default Profile;