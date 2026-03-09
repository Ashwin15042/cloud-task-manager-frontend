import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const response = await API.post("/auth/login", {
        email,
        password
      });

      const token = response.data.token;

      localStorage.setItem("token", token);

      alert("Login successful");

      navigate("/dashboard");

    } catch (error) {

      alert("Login failed");

    }
  };

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-4">

          <h2 className="text-center mb-4">Login</h2>

          <form onSubmit={handleLogin}>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="btn btn-primary w-100">
              Login
            </button>

          </form>

        </div>

      </div>

    </div>

  );
}

export default Login;