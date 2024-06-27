import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootreducers from './components/redux/reducers/main';

// Define your custom middleware here if needed

const middleware = []; // Add your custom middleware here if needed

const store = createStore(
  rootreducers,
  composeWithDevTools(applyMiddleware(...middleware))
);


export default store;
