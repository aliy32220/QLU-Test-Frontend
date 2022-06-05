import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AddTask from "./components/add-task.component";
import Task from "./components/task.component";
import TasksList from "./components/tasks-list.component";
import Insights from "./components/insights";
import logo from './images/logo.png';
import Add from './images/add.png';
import View from './images/Eye.png';
import Graph from './images/graph.png';
class App extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/tasks" className="navbar-brand">
            < img src={logo} alt="Logo" height={50} width={50} />
          </a>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/tasks"} className="nav-link">
              <img src={View} alt = "View" height={20} width={20} color="white"/>View Tasks
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/add"} className="nav-link">
                <img src={Add} alt = "Add" height={20} width={20} color="white"/> Add New Task         
               </Link>
            </li>
            <li className="nav-item">
              <Link to={"/insights"} className="nav-link">
                <img src={Graph} alt = "Graph" height={20} width={20} color="white"/> View Insights         
               </Link>
            </li>
          </div>
        </nav>
        <div className="container mt-3">
          <Routes>
            <Route exact path="/" element={<TasksList/>}></Route>
            <Route exact path= "/tasks" element={<TasksList/>}> </Route>
            <Route exact path="/add" element={<AddTask/>}> </Route>
            <Route path="/tasks/:id" element={<Task/>}> </Route>
            <Route exact path="/insights" element={<Insights/>}></Route>
          </Routes>
        </div>
      </div>
    );
  }
}
export default App;
