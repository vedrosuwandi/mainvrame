import React from 'react'

const Inputs = ({name, placeholder, type, value}) => {
    return (
        <div className="inputs">
            <input type={type} name={name} placeholder={placeholder} data-ms-member={value} />
        </div>
    )
}

export default Inputs
