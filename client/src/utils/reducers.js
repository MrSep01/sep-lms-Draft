import {
  
  SET_CURRENT_USER, // Import the new action type
  UPDATE_USER_ROLE,
} from './actions';

export const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_PRODUCTS:
      return {
        ...state,
        products: [...action.products],
      };

    
    case SET_CURRENT_USER:
      // Update the state with the current user's information
      return {
        ...state,
        user: action.user, // Assuming action.user contains the user object
      };

      case UPDATE_USER:
      return {
        ...state,
        user: action.payload // Update the entire user object
      };

      case UPDATE_USER_ROLE:
      return {
        ...state,
        user: { ...state.user, role: action.role }
      };

    default:
      return state;
  }
};
