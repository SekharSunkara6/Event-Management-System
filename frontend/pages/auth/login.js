import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const router = useRouter();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, new URLSearchParams(form).toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);
      alert("Login successful");
      router.push("/events");
    } catch (error) {
      alert(error.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="username" type="email" placeholder="Email" required value={form.username} onChange={handleChange} className="input" />
        <input name="password" type="password" placeholder="Password" required value={form.password} onChange={handleChange} className="input" />
        <button type="submit" className="btn">Login</button>
      </form>
    </div>
  );
}
