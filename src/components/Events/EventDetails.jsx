import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import Header from "../Header.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEvent, deleteEvent, queryClient } from "../Utils/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { useState } from "react";
import Modal from "../UI/Modal.jsx";

export default function EventDetails() {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  //? Here we are fecthing the data from fetchEvent by using useQuery as the showing UI in EventDetails.jsx
  const params = useParams();
  //? useParams() lets you access dynamic values (like event IDs) from the URL inside your component.
  const { data, isError, isPending, error } = useQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });

  //? Here we are deleting the event by using the useMutation as deleteEvent by passing the id
  //? Naming allias we are using for avoiding the name conflicts
  const { mutate, isPending:isPendingDeletion, isError:isErrorDeletion, error:errorDelection } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"], exact: true });
      navigate("/events");
    },
  });

  function handleDelete() {
    mutate({ id: params.id });
  }

  function handleStartDelete() {
    setIsDeleting(true);
  }

  function handleStopDelete() {
    setIsDeleting(false);
  }

  let content;

  if (isPending) {
    content = (
      <div id="event-details-content" className="center">
        <p>Fetching event data...</p>
      </div>
    );
  }

  if (isError) {
    content = (
      <div id="event-details-content" className="center">
        <ErrorBlock
          title="Failed to load event"
          message={
            error.info?.message || "Failed to fetch data , try again later"
          }
        />
      </div>
    );
  }

  if (data) {
    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>

        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {data.date} @ {data.time}
              </time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isDeleting && (
        <Modal onClose={handleStopDelete}>
          <h2>Are your sure?</h2>
          <p>
            Do you really want to delete this Event? This action cannot be
            undone.
          </p>
          {isPendingDeletion && (<p>Deleting, Please wait...</p>)}
          {!isPendingDeletion && (
            <>
             <div className="form-actions">
            <button className="button-text" onClick={handleStopDelete}>
              Cancel
            </button>
            <button className="button" onClick={handleDelete}>
              Delete
            </button>
          </div>
            </>
          )}
         {isErrorDeletion && (
            <ErrorBlock title="An error occurred" message={errorDelection.info?.message || "Failed to Delete events" }/>
         )}
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
    </>
  );
}
