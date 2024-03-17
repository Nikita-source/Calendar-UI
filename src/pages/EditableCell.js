import {DatePicker, Table} from "rsuite";


const {Cell} = Table;
const EditableCell = ({rowData, dataKey, onChange, formatStartTime, ...props}) => {
    const editing = rowData.status === 'EDIT';
    let date = new Date(rowData[dataKey][0], rowData[dataKey][1] - 1, rowData[dataKey][2], rowData[dataKey][3], rowData[dataKey][4], rowData[dataKey][5], rowData[dataKey][6] / 1000000);

    return (
        <Cell {...props} className={editing ? 'table-content-editing' : ''}>
            {editing ? (
                dataKey === 'startTime' ? (
                    <DatePicker
                        style={{marginBottom: "revert"}}
                        height={20}
                        format="HH:mm"
                        defaultValue={date}
                        cleanable={false}
                        onChange={event => onChange && onChange(rowData.id, dataKey, event)}
                    />
                ) : (
                    <input
                        style={{padding: "revert"}}
                        className="rs-input"
                        defaultValue={rowData[dataKey]}
                        onChange={event => onChange && onChange(rowData.id, dataKey, event.target.value)}
                    />
                )
            ) : (
                dataKey === 'startTime' ? (
                    <span className="table-content-edit-span">{formatStartTime(rowData[dataKey])}</span>
                ) : (
                    <span className="table-content-edit-span">{rowData[dataKey]}</span>
                )
            )}
        </Cell>
    );
};
export default EditableCell;