
import React, { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import './PrimeAutoComplete.css'

const PrimeAutoComplete = (props)=> {
    const [suggestions, setSuggestions] = useState([]);

    const {items, id, callback, placeholder,setValue} = props;

    const changedValue = value => {
        const selectedItemObject = items.find(i=>`${i.item.toUpperCase()} - ${i.description}` === value) ;
        setValue(value)
        return callback(selectedItemObject)
    }
    
    const search = (event) => {
        if (event.query) {
            const filteredSuggestions = 
            items.filter(i => (i.item.toLowerCase().includes(event.query.toLowerCase())) || (i.description.toLowerCase().includes(event.query.toLowerCase())) );
            setSuggestions(filteredSuggestions.map(i=>`${i.item.toUpperCase()} - ${i.description}`));
        } else {
            setSuggestions([]);
        }
    }

    return (
        <div className="card flex justify-content-center">
            <AutoComplete id={id} value={props.value} suggestions={suggestions} completeMethod={search} onChange={(e) => changedValue(e.value)} placeholder={placeholder} />
        </div>
    )
}

export default PrimeAutoComplete
        