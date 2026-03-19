import {useQuery} from "@tanstack/react-query"

import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';
import { fetchEvents } from "../Utils/http.js";


export default function NewEventsSection() {

  //? Using useQuery hook form tanStackQuery as a 3rd party librery for fecting the data from backend
  const {data, isPending,isError,error} = useQuery({
    //? this is the unique key for the query, it can be anything but should be unique
    //? here we are using an array as a key, the first element is the name
    //? of the query and the second element is an object with the parameters we want to
    //? pass to the fetch function
    queryKey: ['events' , {max : 3}],
    //? this is the function that will be called to fetch the data from backend
    //? This is an AbortSignal provided by React Query. It allows you to cancel the fetch request if the component unmounts or if a new request is made before the previous one finishes. You should pass this signal to your fetch function so it can handle cancellation
    queryFn: ({signal, queryKey}) => fetchEvents({signal, ...queryKey[1]}),
    //? this is used to refetch the data after every 5 seconds
    staleTime: 5000,
  })
  
  let content;
  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock title="An error occurred" message={error.info?.message || "Failed to fetch events" }/>
    );
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
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
