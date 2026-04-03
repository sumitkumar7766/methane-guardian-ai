export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-4">
        Methane Guardian AI 🌍
      </h1>

      <p className="text-gray-400 mb-6">
        Real-time methane super-emitter monitoring system
      </p>

      <a
        href="/dashboard"
        className="bg-green-500 px-6 py-3 rounded-lg hover:bg-green-600"
      >
        Go to Dashboard
      </a>
    </div>
  );
}