import React, {useState, useEffect} from 'react';
import { getToken, getUser, removeUserSession } from './Utils/Common';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import styles from "./assets/jss/material-kit-react/views/componentsSections/basicsStyle.js";
import Button from "components/CustomButtons/Button.js";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Close from "@material-ui/icons/Close";
import CustomInput from "components/CustomInput/CustomInput.js";
import Datetime from "react-datetime";
import DatePicker from "react-datepicker";
import Tooltip from "@material-ui/core/Tooltip";
import Radio from "@material-ui/core/Radio";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Popup from 'reactjs-popup';

import DeleteIcon from '@material-ui/icons/Delete';
import ListIcon from '@material-ui/icons/List';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ReorderIcon from '@material-ui/icons/Reorder';

import "assets/scss/material-kit-react.scss?v=1.9.0";
import "react-datepicker/dist/react-datepicker.css";
import 'reactjs-popup/dist/index.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const url = "https://cocolinquation.herokuapp.com";
//const url = "https://api-sgetas-dev.herokuapp.com";

Transition.displayName = "Transition";

export default class Calendar extends React.Component {
//function Calendar(props) {

	constructor() {
		super();
		this.handleLogin = this.handleLogin.bind(this);
	}

	state = {
		user: getUser(),
		calendars: [],
		events: [],
		date: moment().startOf('isoWeek'),
		taille_calendrier: 19,  //3 semaines de travail
		column: [
			
		],
		data: [
			/*{
				nom: "Cocolito",
				chef: "The cehf"
			}*/
		],

		categories: [],

		show: false,
		showEvent: false,
		showEventReaffecter: false,
		showEquipeOrder: false,

		equipe_id: undefined,
		equipe_nom: '',
		equipe_chef: '',
		equipe_camion: '',
		equipe_manoeuvre: '',
		equipe_autre: '',
		equipe_categorie: 'Equipe',

		event_numero: '',
		event_chef: '',
		event_camion: '',
		event_manoeuvre: '',
		event_autre: '',
		event_id_equipe: undefined,
		event_date_debut: undefined,
		event_id_event: undefined,
		event_duration: 1,

		calendar_name: '',
		calendar_cp: '',
		calendar_address: '',

		id_calendar: undefined,

		request_message: '',
		request_from: '',
		request_to: '',
	};

	orderEquipe() {
		var equipes = this.state.equipes;
		equipes.sort((a,b) => a.order - b.order);
		this.setEquipe(equipes);
	}

	componentDidMount() {
		console.log(getToken());
		axios.get(url + '/calendars', {headers: {'Authorization': 'Bearer ' + getToken()} }).then(response => {
			this.setState({ calendars: response.data });
			console.log(this.state.calendars);
		}).catch(error => {
			console.log(error);
		});
	}

	getEvent = () => {
		var swap = [];
		for (var i = 0; i < this.state.taille_calendrier; i++) {
			if (this.state.date.clone().add(i, "day").isoWeekday() < 7) {
				swap.push({
					key: this.state.date.clone().add(i, "day").format('dddd') + " " + this.state.date.clone().add(i, "day").format("DD/MM/YYYY"),
					value: this.state.date.clone().add(i, "day")
				});
			}
		} 
		this.setState({column: swap});
		this.state.column = swap;
		axios.get(url + '/event', {headers: {"x-access-token": getToken()} }).then(response => {
			var events = response.data.Events;
			this.setState({ events: response.data.Events });
			//equipes = response.data.Equipe;
		}).catch(error => {
			console.log(error);
		});
	};

	setEquipe(equipe) {
		this.setState({equipes: equipe});
	}

	getEquipes = () => {
		axios.get(url + '/equipe', {headers: {"x-access-token": getToken()} }).then(response => {
			var equipes = response.data.Equipe;
			equipes.sort((a,b) => a.order - b.order);
			this.setEquipe(equipes);
		}).catch(error => {
			console.log(error);
		}); 
	};

	showModal = e => {
		this.setState({
			show: !this.state.show
		});
	};

	showModalEquipeOrder = e => {
		this.setState({
			showEquipeOrder: !this.state.showEquipeOrder
		});
	};

	showModalEvent = e => {
		this.setState({
			showEvent: !this.state.showEvent
		});
	};

	showModalEventReaffecter = e => {
		this.setState({
			showEventReaffecter: !this.state.showEventReaffecter
		});
	};

	setValues(id_equipe, date_debut, id) {
		this.state.event_id_equipe = id_equipe;
		this.setState({event_id_event: id});

		if (id !== undefined) {
			console.log("couocu");
			axios.get(url + '/event/one', {
				headers: {"x-access-token": getToken()},
				params: {id: id}
			}).then(response => {
				if (!response.data.Events) {
					return;
				}
				this.setState({event_id_event: id});
				this.setState({event_numero: response.data.Events.n_chantier});
				this.setState({event_affaire: response.data.Events.n_affaire});
				this.setState({event_charge: response.data.Events.charge});
				this.setState({event_adresse: response.data.Events.adresse});
				this.setState({event_autre: response.data.Events.autre});
				this.setState({event_date_debut: moment(response.data.Events.debut)});
				this.setState({event_id_equipe: response.data.Events.equipe});
				this.setState({event_duration: response.data.Events.duration});
				console.log("bah ok");
			}).catch(error => {
				console.log(error);
			});
		} else {
			this.setState({event_numero: ''});
			this.setState({event_affaire: ''});
			this.setState({event_charge: ''});
			this.setState({event_adresse: ''});
			this.setState({event_autre: ''});
			this.setState({event_date_debut: date_debut});
			this.setState({event_id_equipe: id_equipe});
			this.setState({event_duration: 1});
		}
	}

	setEquipeValue(id) {
		this.setState({equipe_id: id});

		if (id !== undefined) {
			console.log("couocu");
			axios.get(url + '/equipe/one', {
				headers: {"x-access-token": getToken()},
				params: {id: id}
			}).then(response => {
				this.setState({equipe_nom: response.data.equipe.nom});
				this.setState({equipe_chef: response.data.equipe.chef});
				this.setState({equipe_camion: response.data.equipe.camion});
				this.setState({equipe_manoeuvre: response.data.equipe.manoeuvre});
				this.setState({equipe_autre: response.data.equipe.autre});
				this.setState({equipe_categorie: response.data.categorie.name});
				console.log("bah ok");
			}).catch(error => {
				console.log(error);
			});
		} else {
			this.setState({equipe_nom: ''});
			this.setState({equipe_chef: ''});
			this.setState({equipe_camion: ''});
			this.setState({equipe_manoeuvre: ''});
			this.setState({equipe_autre: ''});
			this.setState({equipe_categorie: 'Equipe'});
		}
	}

	deleteEvent() {
		if (this.state.event_id_event !== undefined) {
			console.log(this.state.event_id_event);
			axios.delete(url + '/event/delete', {
				headers: {"x-access-token": getToken()},
				params: {id: this.state.event_id_event}
			}).then(response => {
				console.log(response.data);
				window.location.reload(false);
			}).catch(error => {
				console.log(error);
			});
		}
	}

	deleteCalendar(id) {
		axios.delete("https://cocolinquation.herokuapp.com/calendars", {
				headers: {'Authorization': 'Bearer ' + getToken()},
				params: {id: id}
			}).then(response => {
			console.log(response.data);
			window.location.reload(false);
		}).catch(error => {
			console.log(error);
		});
	}

	handleLogin(event) {
		console.log(event);
		window.location.reload(true);
		return false;
	}

	add_week() {
		console.log(this.state.date);
		this.state.date.add(1, "week");
		this.getEvent();
		console.log(this.state.date);
		console.log("gg");
	}

	sub_week() {
		console.log(this.state.date);
		this.state.date.subtract(1, "week");
		this.getEvent();
		console.log(this.state.date);
		console.log("gg");
	}

	change_day(new_date) {
		this.state.date = moment(new_date);
		this.getEvent();
		moment.locale("fr");
		console.log(moment("01-06-2018", 'MM-DD-YYYY').locale("fr").format('LLL'));
	}

	generate_tooltipe(event) {
		let text = "chantier : " + event.n_chantier;
		if (event.n_affaire !== "") {
			text += "\nn° affaire : " + event.n_affaire;
		}
		if (event.adresse !== "") {
			text += "\nadresse : " + event.adresse;
		}
		if (event.charge) {
			text += "\nchargé : " + event.charge;
		}
		text += "\nduré : " + event.duration + " jour(s)";
		if (event.autre) {
			text += "\nautre : " + event.autre;
		}
		return text;
	}

	reaffecterEvent() {
		this.showModalEvent();
		this.setState({showEventReaffecter: true})
	}

	render() {

		const useStyles = makeStyles(styles);
		const classes = makeStyles(styles);
 		
 		const handleSubmit_add_calendrier = (event) => {
			event.preventDefault();
			if (this.state.nom == '') {
				console.log("erreur: nom requis");
				return;
			}
			let data = {
				name: this.state.calendar_name,
				address: this.state.calendar_address,
				CP: this.state.calendar_cp,
			}
			axios.post("https://cocolinquation.herokuapp.com/calendars", data
			, {
				headers: {'Authorization': 'Bearer ' + getToken()}
			}).then(response => {
				console.log(response);
				window.location.reload(false);
				//props.history.push('/Calendar');
			}).catch(error => {
				console.log(error);
			});
			//console.log(React.findDOMNode(this.refs.equipe_nom_ref).value);
		}

		const handleSubmit_add_request = (event) => {
			event.preventDefault();
			if (this.state.nom == '') {
				console.log("erreur: nom requis");
				return;
			}
			let data = {
				message: this.state.request_message,
				start_time: this.state.request_from,
				end_time: this.state.request_to,
				calendar_id: this.state.id_calendar
			}
			console.log(data);
			axios.post("https://cocolinquation.herokuapp.com/requests", data
			, {
				headers: {'Authorization': 'Bearer ' + getToken()}
			}).then(response => {
				console.log(response);
				window.location.reload(false);
				//props.history.push('/Calendar');
			}).catch(error => {
				console.log(error);
			});
			//console.log(React.findDOMNode(this.refs.equipe_nom_ref).value);
		}

		return (
			<div>
				<TableContainer component={Paper}>
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow key="header">
								<TableCell>
									Calendrier
									<Button justIcon round color="primary" onClick={e => {
											this.showModal();
										}}
									>+</Button>
								</TableCell>
								<TableCell>
									Code Postal
								</TableCell>
								<TableCell>
									Adresse
								</TableCell>
								<TableCell>
									Faire une demande
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{this.state.calendars.map((calendar) => (
								<TableRow key={calendar.id}>
									<TableCell component="th" scope="row">
										<p>{calendar.name}</p>
									</TableCell>
									<TableCell component="th" scope="row">
										<p>{calendar.CP}</p>
									</TableCell>
									<TableCell component="th" scope="row">
										<p>{calendar.address}</p>
									</TableCell>
									<TableCell>
										<Button justIcon round color="primary" onClick={e => {
											this.state.id_calendar = calendar.id;
											this.showModalEvent();
										}}
									>+</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>


				<Dialog
					classes={{
						root: classes.center,
						paper: classes.modal
					}}
					open={this.state.show}
					TransitionComponent={Transition}
					keepMounted
					onClose={this.showModal}
					aria-labelledby="classic-modal-slide-title"
					aria-describedby="classic-modal-slide-description"
				>
					<DialogTitle
						id="classic-modal-slide-title"
						disableTypography
						className={classes.modalHeader}
					>
						Ajouter un calendrier
						<IconButton
							className={classes.modalCloseButton}
							key="close"
							aria-label="Close"
							color="inherit"
							onClick={this.showModal}
						>
							<Close className={classes.modalClose} />
						</IconButton>
					</DialogTitle>
					<form onSubmit={handleSubmit_add_calendrier}>
						<DialogContent
							id="classic-modal-slide-description"
							className={classes.modalBody}
						>
							<input 
								type="text" 
								value={this.state.calendar_name}
								onChange={event => this.setState({ calendar_name: event.target.value })}
								placeholder="Nom"
								required 
							/>
							<input 
								type="text" 
								value={this.state.calendar_cp}
								onChange={event => this.setState({ calendar_cp: event.target.value })}
								placeholder="Code Postal"
								required 
							/>
							<input 
								type="text" 
								value={this.state.calendar_address}
								onChange={event => this.setState({ calendar_address: event.target.value })}
								placeholder="Adresse"
								required 
							/>
						</DialogContent>
						<DialogActions className={classes.modalFooter}>
							<Button type="submit" color="primary">
								Valider
							</Button>
							<Button
								onClick={this.showModal}
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
						root: classes.center,
						paper: classes.modal
					}}
					open={this.state.showEvent}
					TransitionComponent={Transition}
					keepMounted
					onClose={this.showModalEvent}
					aria-labelledby="classic-modal-slide-title"
					aria-describedby="classic-modal-slide-description"
				>
					<DialogTitle
						id="classic-modal-slide-title"
						disableTypography
						className={classes.modalHeader}
					>
						Faire une demande
						<IconButton
							className={classes.modalCloseButton}
							key="close"
							aria-label="Close"
							color="inherit"
							onClick={this.showModalEvent}
						>
							<Close className={classes.modalClose} />
						</IconButton>
					</DialogTitle>
					<form onSubmit={handleSubmit_add_request}>
						<DialogContent
							id="classic-modal-slide-description"
							className={classes.modalBody}
						>
							<input 
								type="text" 
								value={this.state.request_message}
								onChange={event => this.setState({ request_message: event.target.value })}
								placeholder="message" 
								required 
							/>
							<input 
								type="date" 
								value={this.state.request_from}
								onChange={event => this.setState({ request_from: event.target.value })}
								placeholder="message" 
								required 
							/>
							<input 
								type="date" 
								value={this.state.request_to}
								onChange={event => this.setState({ request_to: event.target.value })}
								placeholder="message" 
								required 
							/>
							
						</DialogContent>
						<DialogActions className={classes.modalFooter}>
							<Button type="submit" color="primary">
								Valider
							</Button>
							<Button
								onClick={this.showModalEvent}
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
}
 
//export default Calendar;
				//<ModalEquipe className="modalEquipe" onClose={this.showModal} show={this.state.show} />

/*

									{this.state.user.isModo && (
										<Button justIcon round color="primary" onClick={e => {
											this.setEquipeValue(undefined);
											this.showModal();
										}}
										>+</Button>
									)}

					this.state.equipes.map((e, i) => {
						return <div key={i}>{e.nom}</div>;
					})



					<ReactTable 
data={tableData} 
columns={columns} 
defaultPageSize = {2} 
pageSizeOptions = {[2,4,6,8]
}  
/>

5fa17b8a58e5d000175ec5e2
5fa1815858e5d000175ec5e3
5fab15b8480adb0017fdb367


*/