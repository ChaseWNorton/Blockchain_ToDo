import { GET_ACCOUNTS } from "../constants/action-types";
import web3 from "../web3.js";
import todo from "../todo.js";

const initialState = {
  accounts: [],
};

const rootReducer = async (state = initialState, action) => {
  switch (action.type) {
    case GET_ACCOUNTS:
      return { ...state, accounts: [0xC2F73063aDFAe34991aDF43fe33143Da3B7b6699] };
    default:
      return state;
  }
};
export default rootReducer;