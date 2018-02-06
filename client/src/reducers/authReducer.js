import { FETCH_USER } from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case FETCH_USER: //if we see a case with the fetchUser then do action below
      return action.payload || false;
    default:
      return state;
  }
}
