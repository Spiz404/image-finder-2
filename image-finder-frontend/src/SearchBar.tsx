
import SearchBar from '@mkyy/mui-search-bar';
import { useState } from "react";
import * as React from 'react';
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface imageItem {
    url : string;
    location : string;
}

const Sb = ({setData} : {setData : (data : Array<imageItem>) => void}) => {

    const [search, setSearch] = useState("");
    const [numResults, setNumResults] = useState(1);

    const handleNumResultsChange = (event : SelectChangeEvent) => {
        setNumResults(parseInt(event.target.value));
    };

    const handleSearch = () => {

      axios.post(`${import.meta.env.VITE_BACKEND_URL}/images/query`, 
        {
          query : search
        }, 
        {
          headers : {
            "Content-Type" : "application/json"
        }
      })
      .then((res) => setData(res.data as Array<imageItem>))
      .catch((err) => console.log(err));
    };

    return (
      <div>
        <SearchBar
          width = '500px'
          value={search}
          onChange={(text : string) => setSearch(text)}
          onSearch={handleSearch}
        />
        <FormControl color="primary" sx={{ m: 1, minWidth: 120, borderRadius: "4px", borderColor: "white" }}>
          <InputLabel id="num-results-label" color = "info" sx={{color: "white"}} >Risultati</InputLabel>
          <Select
            labelId="num-results-label"
            id="num-results-select"
            style = {{color : "white"}}
            value={`${numResults}`}
            label="Risultati"
            onChange={handleNumResultsChange}
            sx={{ color: "white", '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </Select>
        </FormControl>
      </div>
    );
}

export default Sb;