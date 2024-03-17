import axios from 'axios';

const EventPath = 'http://localhost:8080/' + 'events';

export function addEvents(title, startTime, setError) {
    const addEventData = {title, startTime};
    return axios
        .post(EventPath + '/', addEventData, {
            headers: {'Content-Type': 'application/json'}
        })
        .then((result) => result.data)
        .catch((error) => {
            setError(error.response.data.message);
        });
}

export function getAllEvents(setError) {
    return axios
        .get(EventPath + '/all')
        .then((result) => result.data)
        .catch((error) => {
            setError(error.response.data.message);
        });
}

export function editEvent(id, title, startTime, setError) {
    const addEventData = {title, startTime};
    return axios
        .patch(EventPath + '/' + id, addEventData, {
            headers: {'Content-Type': 'application/json'}
        })
        .then((result) => result.data)
        .catch((error) => {
            setError(error.response.data.message);
        });
}

export function deleteEvent(id, setError) {
    return axios
        .delete(EventPath + '/' + id, {
            headers: {'Content-Type': 'application/json'}
        })
        .catch((error) => {
            setError(error.response.data.message);
        });
}
