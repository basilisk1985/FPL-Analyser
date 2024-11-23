
import React, { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import './PrimeAutoComplete.css'

const PrimeAutoComplete = (props)=> {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const {items, id, callback, placeholder} = props;

    const changedValue = value => {
        const selectedItemObject = items.find(i=>`${i.item.toUpperCase()} - ${i.description}` === value) ;
        const updateValue = selectedItemObject && selectedItemObject.description || "";
        setValue(value)
        return callback(updateValue)
    }
    
    const search = (event) => {
        if (event.query) {
            const filteredSuggestions = 
            items.filter(i => (i.item.toLowerCase().startsWith(event.query.toLowerCase())) || (i.description.toLowerCase().startsWith(event.query.toLowerCase())) );
            setSuggestions(filteredSuggestions.map(i=>`${i.item.toUpperCase()} - ${i.description}`));
        } else {
            setSuggestions([]);
        }
    }

    return (
        <div className="card flex justify-content-center">
            <AutoComplete id={id} value={value} suggestions={suggestions} completeMethod={search} onChange={(e) => changedValue(e.value)} placeholder={placeholder} />
        </div>
    )
}

export default PrimeAutoComplete
        