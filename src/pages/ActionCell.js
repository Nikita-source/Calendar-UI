import {IconButton, Table} from "rsuite";
import CheckIcon from "@rsuite/icons/Check";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";

const {Cell} = Table;
const ActionCell = ({rowData, dataKey, onEdit, onSave, onDelete, ...props}) => {
    return (
        <Cell {...props} style={{padding: '6px'}}>
            {rowData.status === 'EDIT' ? (
                <IconButton size="xs" appearance="ghost" icon={<CheckIcon/>} onClick={() => rowData.status === 'EDIT' ? onSave(rowData) : onEdit(rowData)}></IconButton>
            ) : (
                <>
                    <IconButton style={{marginRight:"5px"}} size="xs" appearance="ghost" icon={<EditIcon/>} onClick={() => rowData.status === 'EDIT' ? onSave(rowData) : onEdit(rowData)}></IconButton>
                    <IconButton size="xs" appearance="ghost" color="red" icon={<TrashIcon/>} onClick={() => onDelete(rowData)}></IconButton>
                </>
            )}
        </Cell>
    );
};

export default ActionCell;