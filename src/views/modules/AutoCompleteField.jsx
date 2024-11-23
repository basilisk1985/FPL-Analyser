import React, { useState, useRef, useEffect } from 'react';

const AutoComplete = (props) => {
    const items = props.items ||[]
    const {style, id, placeholder} = props;

    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const containerRef = useRef(null);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(value);

        if (value) {
            const filteredSuggestions = items.filter(item =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
            props.onChange(value)
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        setSuggestions([]);
        // props.onChange(suggestion)
    };

    // Close suggestions when clicking outside of the autocomplete component
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef} style={style || { width: '300px', margin: '0 auto', position: 'relative' }}>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder||"Type to search..."}
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
