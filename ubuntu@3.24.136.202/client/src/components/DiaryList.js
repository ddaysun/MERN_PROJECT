import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const DiaryList = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/entries');
        setEntries(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchEntries();
  }, []);

  if (loading) return <div>Loading our love story...</div>;

  return (
    <DiaryContainer>
      <h1>Our Love Diary</h1>
      <AddButton to="/new-entry">Add New Memory</AddButton>
      
      <EntriesList>
        {entries.map(entry => (
          <EntryCard key={entry._id} to={`/entry/${entry._id}`}>
            <EntryDate>{new Date(entry.date).toLocaleDateString()}</EntryDate>
            <EntryTitle>{entry.title}</EntryTitle>
            <EntryMood>Mood: {entry.mood}</EntryMood>
            {entry.specialDay && <SpecialBadge>Special Day</SpecialBadge>}
          </EntryCard>
        ))}
      </EntriesList>
    </DiaryContainer>
  );
};

// Styled components...
const DiaryContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const EntriesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const EntryCard = styled(Link)`
  /* Styling for cards */
`;

// Other styled components...

export default DiaryList;