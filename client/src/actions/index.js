import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS } from './types';

//action creators are found in this ifle
export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};


//takes token sent from Stripe and adds to back-end server
export const handleToken = (token) => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({type: FETCH_USER, payload: res.data});

};


export const submitSurvey = (values, history)  => async dispatch => {
  const res = await axios.post('/api/surveys', values);

  history.push('/surveys'); //navigates the user back to the surverys screen after submitting a survery
dispatch({type: FETCH_USER, payload: res.data });
};

export const fetchSurveys  = () => async dispatch => {
  const res = await axios.get('/api/surveys');

  dispatch({type: FETCH_SURVEYS, payload: res.data });

};
