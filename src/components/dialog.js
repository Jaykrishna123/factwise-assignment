import React from 'react'
import { XMarkIcon } from "@heroicons/react/20/solid";

function DialogComponent({ CloseDialog, data, deletemode, deleteUser }) {
    return (
        <>
            {deletemode === data.id && <div className='overlay'></div>}
            {deletemode === data.id && <div className='dialog'>
                <span className='delete-title'>Are you sure you want to delete?</span>
                <XMarkIcon width={20} onClick={() => CloseDialog()} height={20} style={{ color: 'gray', position: 'absolute', top: '10px', right: '15px' }} />

                <div className='flex-end delete-btn'>
                    <button className='btn btn-cancel' onClick={() => CloseDialog()}>Cancel</button>
                    <button className='btn btn-delete' onClick={() => deleteUser()}>Delete</button>
                </div>
            </div >
            }
        </>
    )
}

export default DialogComponent