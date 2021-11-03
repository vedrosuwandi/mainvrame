import {BrowserRouter as Router , Switch , Route} from 'react-router-dom';

//Pages
import Home from './FrontEnd/Pages/Home';


function App() {
  return (
    <div className="App">
      <Router>
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
      </Router>
    </div>
  );
}

export default App;
