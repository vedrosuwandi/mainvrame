import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Explore from './Pages/Explore';
import Forms from './Pages/Forms';
import Home from './Pages/Home';
import Academy from './Pages/Academy';

function App() {

  return (
    <div className="App">
       <Router>
       <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
        <Switch>
          <Route exact path="/academy" component={Forms} />
        </Switch>
        <Switch>
          <Route exact path="/academy/explore" component={Explore} />
        </Switch>
        <Switch>
          <Route path="/academy/explore/academy" component={Academy} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
