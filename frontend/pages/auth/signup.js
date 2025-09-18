import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "normal" });
  const router = useRouter();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/signup`, form);
      alert("Signup successful! Please login.");
      router.push("/auth/login");
    } catch (error) {
      alert(error.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl mb-4">Signup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          required
          value={form.name}
          onChange={handleChange}
          className="input"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
          className="input"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
          className="input"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="input"
        >
          <option value="normal">Normal User</option>
          <option value="admin">Admin User</option>
        </select>
        <button type="submit" className="btn">
          Signup
        </button>
      </form>
    </div>
  );
}
