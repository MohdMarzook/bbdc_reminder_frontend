import React, { useState } from 'react';
import LoginPage from './pages/Login.jsx';
import DetailsPage from './pages/Details.jsx';
import ClassesPage from './pages/Classes.jsx';


const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);


export default function App() {
  'login', 'details', 'classes', 'success'
  let featureCount = 0;
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
    settestType('');
    setCourseType('');
    setClassSelect('');
    setClasses('');
    setError('');
    setAuthToken('Null');
    setJsessionid('');
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
        return <DetailsPage handleFetchClasses={handleFetchClasses} username={username} testType={testType} settestType={settestType} isLoading={isLoading} LoadingSpinner={LoadingSpinner} resetToLogin={resetToLogin} />;
      
      case 'classes':
        const title = testType.charAt(0).toUpperCase() + testType.slice(1);
        return <ClassesPage 
          SendReminderRequest={SendReminderRequest} 
          classes={classes} 
          classSelect={classSelect} 
          setClassSelect={setClassSelect} 
          isLoading={isLoading} 
          LoadingSpinner={LoadingSpinner} 
          resetToLogin={resetToLogin} 
          backToDetails={backToDetails}         
          setEmail={setEmail} 
          setDateTime={setDateTime} 
          notifyForAllDay={notifyForAllDay} 
          setNotifyForAllDay={setNotifyForAllDay} 
          title={title} 
          error={error}
          featureCount={featureCount}
        />;

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
        return <LoginPage handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} error={error} isLoading={isLoading} LoadingSpinner={LoadingSpinner} />;
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
