import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
}

function Dashboard() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await API.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTasks(response.data);

    } catch (error) {
      console.log("Error fetching tasks", error);
    }
  };

  
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      await API.post(
        "/tasks",
        {
          title,
          description
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTitle("");
      setDescription("");

      fetchTasks();

    } catch (error) {
      console.log("Error creating task", error);
    }
  };

 
  const handleDeleteTask = async (id: string) => {
    try {

      const token = localStorage.getItem("token");

      await API.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      fetchTasks();

    } catch (error) {
      console.log("Error deleting task", error);
    }
  };

  
  const handleCompleteTask = async (id: string) => {

    try {

      const token = localStorage.getItem("token");

      await API.put(
        `/tasks/${id}`,
        { status: "Completed" },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchTasks();

    } catch (error) {
      console.log("Error updating task", error);
    }

  };

  
  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");

  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (

    <div className="container py-5">

      

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="fw-bold">Task Dashboard</h2>

        <button
          className="btn btn-outline-danger"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <h5 className="card-title mb-3">Add New Task</h5>

          <form onSubmit={handleAddTask}>

            <div className="row g-2">

              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Task Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Task Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-2">
                <button className="btn btn-success w-100">
                  Add
                </button>
              </div>

            </div>

          </form>

        </div>

      </div>

      

      <div className="card shadow-sm">

        <div className="card-body">

          <h5 className="card-title mb-3">Your Tasks</h5>

          {tasks.length === 0 ? (
            <p className="text-muted">No tasks available</p>
          ) : (
            <div className="list-group">

              {tasks.map((task) => (

                <div
                  key={task._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >

                  <div>

                    <h6 className="mb-1 fw-semibold">
                      {task.title}
                    </h6>

                    <small className="text-muted">
                      {task.description}
                    </small>

                    <div className="mt-2">

                      <span
                        className={
                          task.status === "Completed"
                            ? "badge bg-success me-2"
                            : "badge bg-warning text-dark me-2"
                        }
                      >
                        {task.status}
                      </span>

                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handleCompleteTask(task._id)}
                      >
                        Complete
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>

    </div>

  );
}

export default Dashboard;