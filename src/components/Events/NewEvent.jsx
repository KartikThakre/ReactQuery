import { Link, useNavigate } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useMutation } from "@tanstack/react-query";
import { createNewEvent, queryClient } from "../Utils/http.js";
import ErrorBlock from "../UI/ErrorBlock";

export default function NewEvent() {
  const navigate = useNavigate();

  //? here useMutataion hook are use when you trying post a reaquest from frontend to backend

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent,
    //? onSuccess is method to acknowledge the data has been successfully stored. & the invalidateQueries has invalidate the queries as per the queryKey has passed.
    onSuccess : () => {
      //? onSuccess:This is a callback function that runs after the mutation (creating a new event) succeeds.queryClient.invalidateQueries({queryKey : ['event'], exact: true});:
      //? This line tells the query client to refetch the 'event' query, ensuring that the latest data is available in the cache.
      //? exact: true ensures that only the exact query with the key 'event' is invalidated, not any similar queries.
      //? navigate('/events');: This line redirects the user to the '/events' route after the event has been successfully created and the query has been invalidated.
      //? This is useful for updating the UI to reflect the newly created event

      //? we use queryKey for invalidating the queries, so that the data is refetched from the backend and the UI is updated accordingly.
      //? This is useful when you want to update the UI after a mutation has been performed
      //? This is useful for updating the UI to reflect the newly created event


      //? queryClient is used to refresh (invalidate) cached data so your app always displays the latest information after a mutation.
      queryClient.invalidateQueries({queryKey : ['event'], exact: true});
      navigate('/events');
      
    }
  });

  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting..."}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={
            error.info?.message ||
            "Please check the inputs and try again later..."
          }
        />
      )}
    </Modal>
  );
}
