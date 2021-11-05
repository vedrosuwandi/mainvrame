import React from 'react';
import {BrowserRouter as Router , Switch , Route} from 'react-router-dom';

//Pages
import Home from './FrontEnd/Pages/Home';
import Store from './FrontEnd/Store/Store';


function App() {

  return (
    <div className="App">
      <Store>
        <Router>
            <Switch>
              <Store>
                <Route exact path="/" component={Home} />
              </Store>
            </Switch>
        </Router>
      </Store>
    </div>
  );
}

export default App;
