import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { fetchEvents } from '../Utils/http';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorBlock from '../UI/ErrorBlock';
import EventItem from './EventItem';

export default function FindEventSection() {
  const searchElement = useRef();
  //? here we are manages the state as the handleSubmit event occured to shown the specific search result
  const [searchTeam, setSearchTeam]= useState();

  //? here we are trying to fetch the data as per the searchQueryParameter from the http.js file

  const {data, isError, isLoading, error} = useQuery({
    queryKey:['searchEvents', {search : searchTeam}],
    queryFn:({signal, queryKey}) => fetchEvents({signal, searchTerm: queryKey[1].search }),
    //? The query will only run if searchTeam is not undefined.This prevents the query from running on the initial render (when no search has been made yet).
    enabled : searchTeam !== undefined,
  })

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTeam(searchElement.current.value);
  }

  //? Modifying the content as per the useQuery destructing

  let content = <p>Please enter a search term and to find events.</p>;

  if(isLoading){
    content = <LoadingIndicator />
  }

  if(isError){
    <ErrorBlock title="An error occurred" message={error.info?.message || "Failed to fetch events" }/>
  }


  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}
