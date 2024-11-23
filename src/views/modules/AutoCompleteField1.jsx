import React, { useState } from 'react';

const AutoComplete = (props) => {
    // Sample list of items for the autocomplete
    const items = props.items ||[]
    const {style, id} = props;

    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    // Function to handle input change and filter suggestions
    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);

        if (value) {
            const filteredSuggestions = items.filter(item =>
                item.toLowerCase().startsWith(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
            props.onChange(value)
        } else {
            setSuggestions([]);
        }
    };

    // Function to handle suggestion click
    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        props.onChange(suggestion)
        setSuggestions([]); // Hide suggestions after selection
    };

    return (
        <div style={style || { width: '300px', margin: '0 auto', position: 'relative' }}>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type to search..."
                style={{ width: '100%', padding: '8px' }}
                id= {id}
            />

            {suggestions.length > 0 && (
                <ul style={suggestionsStyle}>
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            style={suggestionItemStyle}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// Styles for suggestions list and items
const suggestionsStyle = {
    listStyleType: 'none',
    margin: 0,
    padding: '5px',
    border: '1px solid #ccc',
    borderTop: 'none',
    position: 'absolute',
    width: '100%',
    backgroundColor: 'white',
    maxHeight: '150px',
    overflowY: 'auto', 
    borderRadius:'0 0 5px 5px'
};

const suggestionItemStyle = {
    padding: '8px',
    cursor: 'pointer',
    color:'black',
    fontSize:'12px'
};

export default AutoComplete;
