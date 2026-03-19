import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEvent,updateEvent,queryClient } from "../Utils/http.js";
import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from '../UI/ErrorBlock';
import NewEvent from './NewEvent';

export default function EditEvent() {
  const navigate = useNavigate();

  //? Here we are fecthing the data from fetchEvent request form http.js and showing in the UI
  const params = useParams();
  const { data, isError, isPending, error } = useQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });


  //?mutationFn: updateEvent:
//?This is the function that sends the update request to the backend.

//?onMutate:
//?Runs before the mutation function.

//?Cancels any outgoing fetches for this event (cancelQueries).
//?Saves the current event data (previousEvent) from the cache.
//?Optimistically updates the cache with the new event data (setQueryData).
//?Returns the previous data so it can be restored if needed.
//?onError:
//?Runs if the mutation fails.

//?Restores the previous event data in the cache using the value returned from onMutate.
//?onSettled:
//?Runs after the mutation (whether it succeeds or fails).

//?Invalidates the cache for this event so React Query will refetch the latest data from the server.




//? here we are trying to update the event by using the updateEvent request which is coming form http.js
 const {mutate}  = useMutation({
    mutationFn : updateEvent,
    //? trying to update the event optimistically its needed when you want to update the data quickly
    onMutate : async (data) => {
      const newEvent = data.event;
      await queryClient.cancelQueries({queryKey : ['events', params.id]});
      const previousEvent = queryClient.getQueryData(['events',params.id]);
      queryClient.setQueryData(['events',params.id], newEvent);
      return {previousEvent};
    },
    onError : (context) => {
      queryClient.setQueryData(['events',params.id],context.previousEvent)
    },
    onSettled : () => {
      queryClient.invalidateQueries(['events',params.id]);
    }
  })

  function handleSubmit(formData) {
    mutate({id: params.id, event:formData});
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }

  let content;

  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="Failed to load event"
          message={
            error.info?.message || "Failed to fetch data , try again later"
          }
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }

  if(data){
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    )
  }

  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}
