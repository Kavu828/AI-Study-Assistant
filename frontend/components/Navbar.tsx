export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-6">
      <h1 className="text-3xl font-bold text-cyan-400">
        AI Study Assistant
      </h1>

      <div className="flex gap-6">
        <a href="#" className="hover:text-cyan-400">
          Home
        </a>

        <a href="#" className="hover:text-cyan-400">
          Features
        </a>

        <a href="#" className="hover:text-cyan-400">
          About
        </a>

        <a href="#" className="hover:text-cyan-400">
          Contact
        </a>
      </div>

      <button className="bg-cyan-500 px-5 py-2 rounded-lg hover:bg-cyan-600">
        Login
      </button>
    </nav>
  );
}