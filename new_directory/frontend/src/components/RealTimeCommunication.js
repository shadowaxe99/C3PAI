```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RealTimeCommunication = () => {
  const [meetingStatus, setMeetingStatus] = useState('');
  const [meetingAttendees, setMeetingAttendees] = useState([]);

  useEffect(() => {
    // Fetch meeting status and attendees from backend
    axios.get('/api/meeting')
      .then(response => {
        setMeetingStatus(response.data.status);
        setMeetingAttendees(response.data.attendees);
      })
      .catch(error => console.error(`Error: ${error}`));
  }, []);

  const handleLateUser = (user) => {
    // Inform meeting attendees if a user is running late
    const message = `${user} is running late.`;
    meetingAttendees.forEach(attendee => {
      axios.post('/api/notify', { attendee, message })
        .catch(error => console.error(`Error: ${error}`));
    });
  };

  return (
    <div>
      <h2>Meeting Status: {meetingStatus}</h2>
      <button onClick={() => handleLateUser('John Doe')}>John Doe is running late</button>
    </div>
  );
};

export default RealTimeCommunication;
```