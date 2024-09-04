
import SearchBar from '@mkyy/mui-search-bar';
import { useState } from "react";
import * as React from 'react';
import axios from 'axios';

const Sb = ({setData}) => {

    const [search, setSearch] = useState("");

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
      .then((res) => setData(res.data))
    };

    return (
      <SearchBar
        width = '500px'
        value={search}
        onChange={(text : string) => setSearch(text)}
        onSearch={handleSearch}
      />
    );
}

export default Sb;