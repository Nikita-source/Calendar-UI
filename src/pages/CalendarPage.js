import {useEffect, useRef, useState} from 'react';
import {addEvents, deleteEvent, editEvent, getAllEvents} from "../service/EventService";
import {
    Calendar,
    Whisper,
    Popover,
    Badge,
    IconButton,
    DatePicker,
    Input,
    InputGroup,
    Drawer,
    Timeline,
    Table
} from 'rsuite';
import PlusIcon from '@rsuite/icons/Plus';
import CheckIcon from '@rsuite/icons/Check';
import ErrorContext from "./ErrorContext";
import EditableCell from './EditableCell';
import ActionCell from './ActionCell';

const {Column, HeaderCell, Cell} = Table;
const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [dayEvents, setDayEvents] = useState([]);
    const [error, setError] = useState(ErrorContext);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventStartTime, setNewEventStartTime] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [open, setOpen] = useState(false);
    const createEventModalRef = useRef(null);

    useEffect(() => {
        getEvents();
        setDayEvents(selectedDate ? getEventList(selectedDate) : []);
    }, [selectedDate]);

    function arrayToISOString(arr) {
        const [year, month, day, hour, minute, second, millisecond] = arr;
        const date = new Date(year, month - 1, day, hour, minute, second, millisecond / 1000000);
        return date.toISOString();
    }

    function isoStringToArray(isoStr) {
        const date = new Date(isoStr);
        return [
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds() * 1000000
        ];
    }

    function formatStartTime(startTime) {
        if (startTime && startTime.length >= 6) {
            const [year, month, day, hour, minute, second] = startTime;
            const date = new Date(year, month - 1, day, hour, minute, second);
            const formattedTime = date.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
            return formattedTime;
        } else {
            return 'some time';
        }
    }

    function startTimeToDate(startTime) {
        const [year, month, day, hour, minute, second] = startTime;
        const date = new Date(year, month - 1, day, hour, minute, second);
        return date;
    }

    function getCorrectTimelineElement(selectedDate) {
        const list = getEventList(selectedDate);
        const now = new Date();

        if (list.length > 0) {
        return startTimeToDate(list[0].startTime) > now ? 0 :
            startTimeToDate(list[list.length - 1].startTime) < now ? list.length - 1 :
                list.findIndex(event => startTimeToDate(event.startTime) > now);
        }
    }

    function getEvents() {
        getAllEvents(setError)
            .then(data => setEvents(data))
            .catch(err => console.error(err));
    }

    function createQuickEventHandler() {
        createEventModalRef.current.close();
        if (newEventTitle && newEventStartTime) {
            newEventStartTime.setHours(newEventStartTime.getHours() + 2);
            addEvents(newEventTitle, newEventStartTime, setError).then(() => {
                setNewEventTitle('');
                setNewEventStartTime(null)
            }).then(getEvents);
        }
    }

    function editEventHandler(event) {
        if (event.title && event.startTime) {
            editEvent(event.id, event.title, event.startTime, setError).then(getEvents);
        }
    }

    function deleteEventHandler(event) {
        if (event) {
            deleteEvent(event.id, setError).then(getEvents);
        }
    }

    function getEventList(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        return events.filter(event => {
            const [eventYear, eventMonth, eventDay] = event.startTime;
            return year === eventYear && month === eventMonth - 1 && day === eventDay;
        });
    }

    function handleEditState(rowData) {
        setDayEvents(prevData => prevData.map(item =>
            item.id === rowData.id ? {...item, status: item.status ? null : 'EDIT'} : item
        ));
    }

    function handleChange(id, key, value) {
        setDayEvents(prevData => prevData.map(item =>
            item.id === id ? {...item, [key]: value} : item
        ));
    }

    function handleDeleteState(rowData) {
        const nextData = [...dayEvents];
        const filteredData = nextData.filter(item => item.id !== rowData.id);
        setEvents(filteredData);
        setDayEvents(filteredData);
        deleteEventHandler(rowData);
    }

    function handleSaveState(rowData) {
        const nextData = [...dayEvents];
        const activeItem = nextData.find(item => item.id === rowData.id);
        activeItem.status = null;
        if (!Array.isArray(activeItem.startTime)) {
            activeItem.startTime = isoStringToArray(activeItem.startTime);
        }
        setEvents(nextData);
        editEventHandler(activeItem);
    }

    function renderCalendarCell(date) {
        const list = getEventList(date);
        const displayList = list.slice(0, 2);

        if (list.length) {
            const moreCount = list.length - displayList.length;
            const moreItem = (
                <li>
                    <Whisper
                        placement="top"
                        trigger="hover"
                        speaker={
                            <Popover>
                                <Timeline isItemActive={index => index === getCorrectTimelineElement(date)}>
                                    {list.map((item, index) => (
                                        <Timeline.Item key={index}>
                                            <b>{formatStartTime(item.startTime)}</b> - {item.title}
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            </Popover>
                        }
                    >
                        <a>{moreCount} more</a>
                    </Whisper>
                </li>
            );

            return (
                <>
                    <ul className="calendar-todo-list" style={{listStyleType: 'none', padding: '0', margin: '0'}}>
                        {displayList.map((item, index) => (
                            <li key={index} style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                <Badge/> <b>{formatStartTime(item.startTime)}</b> - {item.title}
                            </li>
                        ))}
                        {moreCount ? moreItem : null}
                    </ul>
                </>
            );
        }
        return null;
    }

    return (
        <>
            <Whisper
                ref={createEventModalRef}
                trigger="click"
                rootClose={false}
                placement={'rightStart'}
                controlId={'control-id-rightStart'}
                speaker={
                    <Popover title="Create Quick Event">
                        <InputGroup size={"xs"} style={{marginBottom: 10}}>
                            <Input placeholder={'Title'} value={newEventTitle} onChange={(value) => setNewEventTitle(value)}/>
                        </InputGroup>
                        <DatePicker size="xs" placeholder={'Event time'} format="MM/dd/yyyy HH:mm" value={newEventStartTime} onChange={(value) => setNewEventStartTime(value)}/>
                        <IconButton style={{marginLeft: 10}} size="xs" icon={<CheckIcon/>} onClick={createQuickEventHandler}></IconButton>
                    </Popover>
                }
            >
                <IconButton appearance="subtle" style={{display: 'flex'}} icon={<PlusIcon/>}>Add event</IconButton>
            </Whisper>
            <Calendar bordered renderCell={renderCalendarCell} onSelect={(date) => {
                setSelectedDate(date);
                setOpen(true);
            }}/>

            <Drawer backdrop={true} open={open} onClose={() => setOpen(false)}>
                <Drawer.Header>
                    <Drawer.Title>{`Date: ${selectedDate?.toDateString()}`}</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                    {selectedDate ? (() => {
                        return (
                            <Table data={dayEvents} height={500}>
                                <Column width={20} rowSpan={(rowData) => {
                                    if (dayEvents.length > 0 && rowData.id === dayEvents[0].id) {
                                        return dayEvents.length;
                                    }
                                }}>
                                    <HeaderCell> </HeaderCell>
                                    <Cell>
                                        <Timeline isItemActive={index => index === getCorrectTimelineElement(selectedDate)}>
                                            {dayEvents.map((item, index) => (
                                                <Timeline.Item style={{height: "45px"}} key={index}/>
                                            ))}
                                        </Timeline>
                                    </Cell>
                                </Column>
                                <Column width={120}>
                                    <HeaderCell>Time</HeaderCell>
                                    <EditableCell dataKey="startTime" formatStartTime={formatStartTime} onChange={handleChange}/>
                                </Column>
                                <Column flexGrow={1}>
                                    <HeaderCell>Event title</HeaderCell>
                                    <EditableCell dataKey="title" formatStartTime={formatStartTime} onChange={handleChange}/>
                                </Column>
                                <Column width={100}>
                                    <HeaderCell>...</HeaderCell>
                                    <ActionCell dataKey="id" onClick={handleEditState} onSave={handleSaveState} onEdit={handleEditState} onDelete={(rowData) => {
                                        if (window.confirm("Are you sure you want to delete this item?")) {
                                            handleDeleteState(rowData);
                                        }
                                    }}/>
                                </Column>
                            </Table>
                        );
                    })() : null}
                </Drawer.Body>
            </Drawer>
        </>
    );
};
export default CalendarPage;
