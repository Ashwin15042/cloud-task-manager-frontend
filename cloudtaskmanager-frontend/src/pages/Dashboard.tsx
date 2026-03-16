import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import PreviousTasks from "../components/PreviousTasks";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  date?: string;
}

function Dashboard() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [randomMessage, setRandomMessage] = useState("");

  const navigate = useNavigate();
  const notifiedTasks = useRef(new Set<string>());

  const messages = [
    "Stay focused and finish your tasks! 🚀",
    "You’re doing great today! Keep going! 💪",
    "Small progress is still progress! 📈",
    "Make today productive and awesome! 🔥",
    "Believe in yourself and keep building! ✨",
    "Your future self will thank you! 😄",
    "Consistency beats motivation! ⚡"
  ];

  // 🌞 Time-based greeting
  const hour = new Date().getHours();

  let greeting = "Hello";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";


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
          description,
          date
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTitle("");
      setDescription("");
      setDate("");

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

    if (Notification.permission !== "granted") {

      Notification.requestPermission();

    }

    fetchTasks();

    const random =
      messages[Math.floor(Math.random() * messages.length)];

    setRandomMessage(random);

  }, []);

  useEffect(() => {

    const interval = setInterval(() => {

      const now = new Date();

      tasks.forEach((task) => {

        if (task.date && !notifiedTasks.current.has(task._id)) {

          const taskTime = new Date(task.date);

          const diff = taskTime.getTime() - now.getTime();

          if (diff > 0 && diff <= 3600000) {

            new Notification("⏰ Upcoming Task Reminder", {
              body: `${task.title} starts in 1 hour`
            });

            notifiedTasks.current.add(task._id);

          }

        }

      });

    }, 60000);

    return () => clearInterval(interval);

  }, [tasks]);

  return (

    <div className="container py-5">

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h2 className="fw-bold">
            {greeting} Ashwin 👋
          </h2>

          <p className="text-muted">
            {randomMessage}
          </p>

        </div>

        <button
          className="btn btn-outline-danger"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* Add Task */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <h5 className="card-title mb-3">Add New Task</h5>

          <form onSubmit={handleAddTask}>

            <div className="row g-2">

              <div className="col-md-3">

                <input
                  type="text"
                  className="form-control"
                  placeholder="Task Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

              </div>

              <div className="col-md-4">

                <input
                  type="text"
                  className="form-control"
                  placeholder="Task Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />

              </div>

              <div className="col-md-3">

                <input
                  type="datetime-local"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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

      {/* Task List */}

      <PreviousTasks
        tasks={tasks}
        onDelete={handleDeleteTask}
        onComplete={handleCompleteTask}
      />

    </div>

  );

}

export default Dashboard;
