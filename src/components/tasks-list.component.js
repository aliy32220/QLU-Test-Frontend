import React, { Component } from "react";
import TaskDataService from "../services/task.service";
import { Link } from "react-router-dom";
import { Router } from "react-router-dom";
import Pagination from "./pagination"
export default class TasksList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveTasks = this.retrieveTasks.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveTask = this.setActiveTask.bind(this);
    this.removeAllTasks = this.removeAllTasks.bind(this);
    this.searchTitle = this.searchTitle.bind(this);
    this.router = [0];
    this.state = {
      tasks: [],
      currentTasks : [],
      currentTask: null,
      currentIndex: -1,
      searchTitle: "",
      page: 1,
      count: 0,
      pageSize: 3,
      totalPages: null,
      currentPage: null
    };
    this.pageSizes = [10];
  }
  componentDidMount() {
    this.retrieveTasks();
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;
    this.setState({
      searchTitle: searchTitle
    });
  }

  getRequestParams(searchTitle, page, pageSize) {
    let params = {};
    if (searchTitle) {
      params["title"] = searchTitle;
    }
    if (page) {
      params["page"] = page - 1;
    }
    if (pageSize) {
      params["size"] = pageSize;
    }
    return params;
  }

  retrieveTasks() {
    const { searchTitle, page, pageSize } = this.state;
    const params = this.getRequestParams(searchTitle, page, pageSize);
    TaskDataService.getAll(params)
      .then((response) => {
        const tasks = response.data;
        const totalPages = tasks.size;
        this.setState({
          tasks: tasks,
          count: totalPages,
        });
        console.log(response.data);
        console.log(this.state.tasks);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveTasks();
    this.setState({
      currentTask: null,
      currentIndex: -1
    });
  }

  setActiveTask(task, index) {
    this.setState({
      currentTask: task,
      currentIndex: index
    });
  }

  removeAllTasks() {
    TaskDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchTitle() {
    TaskDataService.findByTitle(this.state.searchTitle)
      .then(response => {
        this.setState({
          tasks: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  onPageChanged = data => {
    const { tasks } = this.state;
    const { currentPage, totalPages, pageLimit } = data;
    console.log(data)
    const offset = (currentPage - 1) * pageLimit;
    const currentTasks = tasks.slice(offset, offset + pageLimit);
    console.log(currentTasks)

    this.setState({ currentPage, currentTasks, totalPages });
  };

  
  render() {
    const { searchTitle, tasks, currentTask, currentIndex, page, count, pageSize, currentPage, totalPages } = this.state;
    const totalTasks = this.state.tasks.length;

    const headerClass = [
      "text-dark py-2 pr-4 m-0",
      currentPage ? "border-gray border-right" : ""
    ]
      .join(" ")
      .trim();
    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Tasks List</h4>
          <div className="mt-3">
          <h2 className={headerClass}>
                <strong className="text-secondary">{totalTasks}</strong>{" "}
                Tasks
          </h2>
          {page && (
                <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                  Page <span className="font-weight-bold">{page}</span> /{" "}
                  <span className="font-weight-bold">{totalPages}</span>
                </span>
              )}
          <div className="d-flex flex-row py-4 align-items-center">
              <Pagination
                totalRecords={totalTasks}
                pageLimit={10}
                pageNeighbours={1}
                onPageChanged={this.onPageChanged}
              />
            </div>
          </div>
          <ul className="list-group">
            {tasks &&
              tasks.map((task, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveTask(task, index)}
                  key={index}
                >
                  {task.title}
                </li>
              ))}
          </ul>
          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllTasks}
          >
            Remove All
          </button>
        </div>
        <div className="col-md-6">
          {currentTask ? (
            <div>
              <h4>Task</h4>
              <div>
                <label>
                  <strong>Title:</strong>
                </label>{" "}
                {currentTask.title}
              </div>
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {currentTask.description}
              </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentTask.status ? "Completed" : "Pending"}
              </div>
              <Link
                to={{pathname:"/tasks/"+ currentTask.id, fromDashboard: true }}>
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Task...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
