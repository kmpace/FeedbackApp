import axios from 'axios';
import { FETCH_USER } from './types';

//action creators
export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};


//takes token sent from Stripe and adds to back-end server
export const handleToken = (token) => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({type: FETCH_USER, payload: res.data});

};
