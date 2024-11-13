import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await login(email, password);
      localStorage.setItem("token", data.createToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id:
            data.isExistUser?.role === "CUSTOMER"
              ? data.isExistUser.customer
              : data.isExistUser.vendor,
          email: data.isExistUser.email,
          role: data.isExistUser.role,
        })
      );
      console.log({
        id: data.isExistUser._id,
        name:
          data.isExistUser?.role === "CUSTOMER"
            ? data.isExistUser.customer.name
            : data.isExistUser.vendor.name,
        role: data.isExistUser.role,
      });
      navigate("/home");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-md rounded-md"
      >
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
