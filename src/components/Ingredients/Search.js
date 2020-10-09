import React,{useState,useEffect} from 'react';
import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const [enterdFilter, setEnterdFilter] = useState("")

  useEffect(()=>{

  },[enterdFilter])
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" value={enterdFilter} onChange={e =>setEnterdFilter(e.target.value)}/>
        </div>
      </Card>
    </section>
  );
})

export default Search;
