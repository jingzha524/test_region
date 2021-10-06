// React
import React, {useEffect}from "react";
// Components & Hooks
import Test_region from "./Test_regions";

import 'semantic-ui-css/semantic.min.css'
import {HEProvider} from './HEProvider';

// import Test_region from "./Test_region";

import { StitchAuthProvider, useStitchAuth} from "./StitchAuth";



import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";


App.propTypes = {};
export default function App() {

  return (
    <StitchAuthProvider>
      <AppUI />
    </StitchAuthProvider>
  );
}

AppUI.propTypes = {};
function AppUI() {
  const {
    isLoggedIn,
    actions: { handleLogout, handleAnonymousLogin },
  } = useStitchAuth();

  useEffect(()=>{
    handleAnonymousLogin();
  });

  return (
    <HEProvider>
      <Router>
        <Switch>
          <Route path='/'>
            <Test_region />
          </Route>
          <Route path="*">
            <Redirect to='/'/>
          </Route>
        </Switch>
      </Router>
      </HEProvider>
  );
}

