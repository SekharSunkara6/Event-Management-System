import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/auth/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="flex space-x-4">
        <Link href="/events">
          <a>Events</a>
        </Link>
        {role === "admin" && (
          <Link href="/admin/events">
            <a>Manage Events</a>
          </Link>
        )}
      </div>
      <div>
        {role ? (
          <button onClick={logout} className="hover:underline">
            Logout
          </button>
        ) : (
          <>
            <Link href="/auth/login">
              <a className="mr-4">Login</a>
            </Link>
            <Link href="/auth/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
