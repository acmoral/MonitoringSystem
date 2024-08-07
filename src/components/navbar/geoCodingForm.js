import React, { useState, useEffect } from 'react';
import { Form, FormControl } from 'react-bootstrap';
import './geocoding.css'
/**
 * A form that fetches and displays geocoding suggestions.
 * @component
 * @param {object} props - The component props.
 * @param {Function} props.handlePress - A function that handles the selected suggestion.
 * @returns {JSX.Element} - The component
 * @example
 * <GeocodingForm handlePress={handlePress} />
 * 
 * @example
 * function handlePress(coordinates) {
 *  console.log('Selected coordinates:', coordinates);
 * }
 *  
 *  <GeocodingForm handlePress={handlePress} />
 *  
 */
const GeocodingForm = ({ handlePress }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [fetchSuggestions, setFetchSuggestions] = useState(true);
  useEffect(() => {
    if (input&& fetchSuggestions) {
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${input}&proximity=ip&access_token=pk.eyJ1IjoiYWNtb3JhIiwiYSI6ImNsdHlnbGszMDBpMGUyaG8wMHNzd3NvcTAifQ.Ger587FmqVP5qcFPz7mwqg`);
          const data = await response.json();
          setSuggestions(data.features || []); // Adjust this based on your API response structure
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [input,fetchSuggestions]);
  const handleSuggestionClick = (suggestion) => {
    setFetchSuggestions(false);
    setInput(suggestion.properties.name_preferred);  // Update the input value
    setSuggestions([]);    // Clear the suggestions list
    handlePress(suggestion.geometry.coordinates);  // Call handlePress with the clicked suggestion
  };
  const handleChange = (e) => {
    setInput(e.target.value);
    setFetchSuggestions(true);  // Enable fetching suggestions
  };
  return (
    <div className="geocoding-form">
      <Form className="my-1 my-lg-0">
        <FormControl
          type="text"
          placeholder="country"
          className="mr-sm-2"
          value={input}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              //when pressing enter select the first suggestion
              if (suggestions.length > 0) {
                handleSuggestionClick(suggestions[0]);
              } else {
                handleSuggestionClick({ properties: { name_preferred: input }, geometry: { coordinates: [0,0] } });
              }
              e.preventDefault();
            }
          }}
        />
      </Form>
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.properties.full_address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GeocodingForm;
