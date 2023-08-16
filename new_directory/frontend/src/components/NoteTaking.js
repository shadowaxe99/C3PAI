```javascript
import React, { useState, useEffect } from 'react';

const NoteTaking = () => {
    const [meetingNotes, setMeetingNotes] = useState([]);

    useEffect(() => {
        // Listen for 'meetingUpdate' messages
        window.addEventListener('meetingUpdate', handleMeetingUpdate);
        return () => {
            // Cleanup listener on component unmount
            window.removeEventListener('meetingUpdate', handleMeetingUpdate);
        };
    }, []);

    const handleMeetingUpdate = (event) => {
        // Update meeting notes state with new notes
        setMeetingNotes(event.detail.notes);
    };

    return (
        <div id="meetingNotesDisplay">
            <h2>Meeting Notes</h2>
            {meetingNotes.length > 0 ? (
                meetingNotes.map((note, index) => (
                    <p key={index}>{note}</p>
                ))
            ) : (
                <p>No notes available</p>
            )}
        </div>
    );
};

export default NoteTaking;
```