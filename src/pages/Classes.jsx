export default function ClassesPage({ SendReminderRequest, classes, classSelect, setClassSelect, isLoading, LoadingSpinner, resetToLogin, backToDetails, setEmail, setDateTime, notifyForAllDay, setNotifyForAllDay, title , error}) {
    return <>
          <form onSubmit={SendReminderRequest}>
          <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-4">
                <button onClick={backToDetails} className="text-sm text-blue-600 hover:underline">
                    &larr; Back
                </button>
                 <button onClick={resetToLogin} className="text-sm text-gray-600 hover:text-gray-800 transition">Logout</button>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{title} Class</h2>
            <b>Select the class you want to set a reminder for</b>
            {classes.length > 0 ? (
              <ul className="space-y-3">
                <select
                  id="classSelect"
                  value={classSelect}
                  onChange={(e) => setClassSelect(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="select">Select a class</option>
                  {classes.map((cls) => (
                      <option key={cls} className="font-semibold text-gray-800">{cls}</option>
                  ))} 
                </select>
             
              </ul>
            ) : <p className="text-gray-500">No classes found for this type.</p>}
            <b>Enter your E-mail ID</b>
            <input onChange={(e) => setEmail(e.target.value)} className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' type="email" required />
            <b>Enter the date and time</b>
            <p><label htmlFor="allDay" className="inline-flex items-center">
              <input onClick={() => setNotifyForAllDay(!notifyForAllDay)} type="checkbox" defaultChecked={notifyForAllDay} id="allDay" className="mr-2" />
              All Day
            </label></p>
            <input onChange={(e) => setDateTime(e.target.value)} min={new Date().toISOString().slice(0, 16)} className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' type={(notifyForAllDay ? "date" : "datetime-local")} required />
            <b>Note </b>
            <p>Check "All Day" if you want to get notified if any slot available for that day, <br />For a specific slot set the appropriate start time.</p>
            {isLoading ? <LoadingSpinner /> : (
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 mt-4">
                  Set Reminder
                </button>
              )}
            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          </div>
          </form>
        </>
}