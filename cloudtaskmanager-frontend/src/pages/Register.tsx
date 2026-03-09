import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      await API.post("/auth/register", {
        name,
        email,
        password
      });

      alert("Registration successful");

      navigate("/");

    } catch (error) {

      alert("Registration failed");

    }
  };

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-4">

          <h2 className="text-center mb-4">Register</h2>

          <form onSubmit={handleRegister}>

            <div className="mb-3">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="btn btn-success w-100">
              Register
            </button>

          </form>

        </div>

      </div>

    </div>

  );
}

export default Register;