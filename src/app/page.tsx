export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="flex flex-col gap-4 bg-white p-8 rounded shadow-md">
        <label htmlFor="movie" className="text-lg font-medium">
          Enter a movie name:
        </label>
        <input
          id="movie"
          name="movie"
          type="text"
          placeholder="Movie name"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>
    </div>
  );
}