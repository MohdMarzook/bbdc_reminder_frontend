export default function LoginPage({ handleLogin, username, setUsername, password, setPassword, error, isLoading, LoadingSpinner }) {
  return (
        <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign In</h2>
        <form onSubmit={handleLogin}>
            <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">Username</label>
            <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., user123"
            />
            </div>
            <div className="mb-6">
            <label htmlFor="password"className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=""
            />
            </div>
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            {isLoading ? <LoadingSpinner /> : (
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                Login
            </button>
            )}
            
        </form>
        </div>
    );
}