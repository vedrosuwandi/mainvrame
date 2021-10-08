import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Explore from './FrontEnd/Pages/Explore';
// import Forms from './FrontEnd/Pages/Forms';
import Home from './FrontEnd/Pages/Home';
import Academy from './FrontEnd/Pages/Academy';


function App() {

  return (
    <div className="App">
      <Router>
       <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/academy" component={Explore} />
          <Route exact path="/academy/explore" component={Academy} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
