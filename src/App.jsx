import React, { useState } from 'react';




const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);


export default function App() {
  'login', 'details', 'classes', 'success'
  const [view, setView] = useState('login'); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [testType, settestType] = useState('practical');
  const [courseType, setCourseType] = useState('');
  const [classSelect, setClassSelect] = useState('select');
  const [classes, setClasses] = useState([1.01, 1.02, 1.03]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authToken, setAuthToken] = useState("null"); 
  const [jsessionid , setJsessionid] = useState(""); 
  const [email, setEmail] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [notifyForAllDay, setNotifyForAllDay] = useState(false);

  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Username and password cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError('');

    
    try {
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        return;
      }

      
      const data = await response.json();

      
      if (data.error) {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
        return;
      }
      if(data.status == 'success'){
        
        setAuthToken(data.auth_token);
        setJsessionid(data.jsessionid);
        

        setIsLoading(false);
        setView('details'); 
      }
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      setError('Invalid credentials. Please try again.');
    }
  };
  
  
  const handleFetchClasses = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/fetchClass/${testType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username, authToken: authToken, jsessionid: jsessionid })
    });
    if (!response.ok) {
      setError('Failed to fetch classes. Please try again.');
      setIsLoading(false);
      return;
    }
    else{
      const data = await response.json()  ;
      
      setClasses(data[0] || []);
      setCourseType(data[1] || null);
      setView('classes');
    }
      setIsLoading(false);
  };

  const SendReminderRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let finaldatetime = dateTime;
      if(notifyForAllDay){
        finaldatetime = dateTime + "T00:00";
      }
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/setreminder`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          username: username, 
          testType: testType, 
          classSelect: classSelect, 
          courseType: courseType,
          email: email, 
          dateTime: finaldatetime, 
          authToken: authToken, 
          jsessionid: jsessionid 
        })
     });
  
      const data = await response.json();
      
      
      if (!response.ok) {
        setError(data.message || 'Failed to set reminder. Please try again.');
        setIsLoading(false);
        return;
      } 
      
      // Handle successful response
      if (data.status === 'success') {
        
        setView('success');
      } else {
        setError(data.message || 'Failed to set reminder. Please try again.');
      }
      
    } catch (error) {
      console.error('Error setting reminder:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToLogin = () => {
    setView('login');
    setUsername('');
    setPassword('');
    setIsLoading(false);
    setError('');
  };

  const backToDetails = () => {
    setIsLoading(false);
    setView('details');
    setClasses([]);
    setError('');
  }

  // Render different views based on the current state
  const renderView = () => {
    switch (view) {
      case 'details':
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
          </div>
        );
      
      case 'classes':
        const title = testType.charAt(0).toUpperCase() + testType.slice(1);
        return (
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
        );

      case 'success':
        return (
          <div className="animate-fade-in text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Success!</h2>
            <p className="text-gray-700 mb-6">Your reminder has been set successfully.</p>
            <p>Please check the mail to confirm.</p>
            <button onClick={resetToLogin} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 mt-5">
              Back to Login
            </button>
          </div>
        );

      case 'login':
      default:
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
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 font-sans">
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        `}</style>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 transition-all duration-300">
        {renderView()}
      </div>
    </div>
  );
}
