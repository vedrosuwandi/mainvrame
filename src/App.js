import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import Renovate from './FrontEnd/Pages/Renovate';
import Home from './FrontEnd/Pages/Home';
import Academy from './FrontEnd/Pages/Academy';
import Explore from './FrontEnd/Pages/Explore';
import Forms from './FrontEnd/Pages/Forms';



function App() {

  return (
    <div className="App">
      <Router>
       <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/academy" component={Forms} />
          <Route exact path="/academy/explore" component={Explore} />
          <Route path="/mainvrame-academy" component={Academy} />
        </Switch>
      </Router>
    </div>
  );

}

export default App;
