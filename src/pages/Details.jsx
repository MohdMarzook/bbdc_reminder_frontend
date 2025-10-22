import PrevReminder from "./PrevReminder";

export default function DetailsPage({ handleFetchClasses, username, testType, settestType, isLoading, LoadingSpinner, resetToLogin , featureCount }) {
   
    const PrevReminderHandler = (e) => {
        e.preventDefault();
        fetch('https://ntfy.sh/slot', {
            method: 'POST',
            body: `Feature needed`,
        })
        alert(`Previous Reminders feature coming soon!`);
    }
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-gray-800">Select Course Type</h2>
                 <button onClick={resetToLogin} className="text-sm text-gray-600 hover:text-gray-800 transition">Logout</button>
            </div>
            <p className="text-gray-600 mb-6">Welcome, {username}! Please select a course type to see the class list.</p>
            <form onSubmit={handleFetchClasses}>
              <div className="mb-4">
                <label htmlFor="testType" className="block text-gray-700 font-semibold mb-2">Test Type</label>
                <select
                  id="testType"
                  value={testType}
                  onChange={(e) => settestType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="theory">Theory</option>
                  <option value="practical">Practical</option>
                  <option value="test">Test</option>
                </select>
              </div>
              {isLoading ? <LoadingSpinner /> : (
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                  Fetch Classes
                </button>
              )}
            </form>
            <div className="pt-3">
                <form onSubmit={PrevReminderHandler}>
                    {isLoading ? <LoadingSpinner /> : (
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                        Previous Reminders
                        </button>
                    )}
                </form>
              </div>
          </div>
    );
}