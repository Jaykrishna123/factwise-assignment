import React, { useEffect, useState } from 'react';
import './App.css';
import celebrities from './celebrities.json'
import { MagnifyingGlassIcon, ChevronDownIcon, PencilIcon, TrashIcon, XCircleIcon, XMarkIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import DialogComponent from './components/dialog';

function App() {
  const [celebritiesData, setCelebritiesData] = useState(celebrities);
  const [searchValue, setSearchValue] = useState("");
  const [dropdown, setDropdown] = useState('');
  const [editingmode, setEditingMode] = useState(false);
  const [deletemode, setDeleteMode] = useState('');
  const [state, setState] = useState({});
  const [editFields, setEditFields] = useState({
    first: '',
    last: '',
    dob: '',
    gender: '',
    country: '',
    description: '',
    editMode: true,
  });
  const [errormsg, setErrorMsg] = useState({
    age: '',
    country: ''
  })
  const [submitted, setSubmitted] = useState('')

  const SearchUsers = (value) => {
    if (value.length === 0) {
      setCelebritiesData(celebrities);
    } else {
      setCelebritiesData(
        celebrities.filter(
          (el) =>
            el.first.toLowerCase().includes(value.toLowerCase()) ||
            el.last.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const toggleDropdown = (data) => {
    if (editingmode) {
      if (data === editingmode) {
        setDropdown(data)
      }
    }
    else {
      setDropdown(data)
    }
  };

  const toggleEditingMode = (id) => {
    setEditingMode(id);
    let newData = celebritiesData.find((user) => user.id === id)
    newData.dob = editFields.dob || calculateAge(newData.dob)
    setEditFields(newData)
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "name") {
      setEditFields({ ...editFields, first: value, last: '' });
    }
    else {
      setEditFields({ ...editFields, [name]: value });
    }
  };

  const handleSelectChange = (event) => {
    setEditFields({ ...editFields, gender: event.target.value });
  };

  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const diff = Date.now() - dob.getTime();
    const age = new Date(diff);
    return Math.abs(age.getUTCFullYear() - 1970);
  };

  const deleteUser = (id) => {
    const newData = celebritiesData.filter((el, i) => el.id !== id)
    setCelebritiesData(newData);
    setDeleteMode(id);
  }

  const OpenDialog = (id) => {
    setDeleteMode(id)
    document.body.style.overflow = "hidden";
  }

  const CloseDialog = () => {
    setDeleteMode(false)
    document.body.style.overflow = "auto";
  }
  const onSubmitUser = (id) => {
    let countryregex = /^[a-zA-Z\s-]+$/
    if (isNaN(editFields.dob)) {
      setErrorMsg({ age: "Age should be a number" });
    } else if (parseInt(editFields.dob) < 0 || parseInt(editFields.dob) > 120) {
      setErrorMsg({ age: "Age should be between 0 and 120" });
    }
    else if (!countryregex.test(editFields.country)) {
      setErrorMsg({ country: "Enter a valid country name" });
    }
    else {
      const updatedUsers = celebritiesData.map((user) => {
        if (user.id === editingmode) {
          return { ...user, ...editFields };
        } else {
          return user;
        }
      });
      setCelebritiesData(updatedUsers);
      setEditingMode(false)
      setErrorMsg({});
      setSubmitted(id)
      setState({});
    }
  }
  let fullName = editFields.first + editFields.last;

  return (
    <div className="main-container">
      <div className="search-input">
        <MagnifyingGlassIcon className="search-icon" width={25} height={25} />
        <input
          placeholder="Search User"
          value={searchValue}
          className='input-text'
          onChange={(e) => {
            setSearchValue(e.target.value);
            SearchUsers(e.target.value);
          }}
        />
      </div>
      {celebritiesData.length === 0 ? (
        <span>No User Found ...</span>
      ) : (
        celebritiesData.map((el, index) => (
          <a className='card-container' onClick={() => toggleDropdown(el.first)} key={el.id}>
            <div className="container">
              <div className="sec">
                <img src={el.picture} alt="logo" />
                {editingmode === el.id ? <input name='name' className='input-name' onChange={(e) => handleInputChange(e)}
                  placeholder='Enter name' value={fullName} /> :
                  <span>{el.first} {el.last}</span>
                }
              </div>
              <ChevronDownIcon width={30} height={30} className={`chevron ${dropdown === el.first ? 'chev-up' : ''}`} />
            </div>
            <div className={`card-sec ${dropdown === el.first ? "active" : ''}`}>
              <div className='expandable'>
                <div className='card'>
                  <div className='flex-col w-30'>
                    <span className='title'>Age</span>
                    {editingmode === el.id ? <input type="text" className='input-box' name='dob' placeholder='enter age'
                      value={editFields.dob}
                      onChange={(e) => handleInputChange(e)}
                    />
                      : <span>{submitted === el.id ? el.dob : calculateAge(el.dob)} Years</span>
                    }
                    {errormsg && <span className='errormsg'>{errormsg.age}</span>}
                  </div>
                  <div className='flex-col w-30'>
                    <span className='title'>Gender</span>
                    {editingmode === el.id ?
                      <select
                        id="gender"
                        name="gender"
                        value={editFields.gender || el.gender}
                        onChange={handleSelectChange}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Transgender</option>
                        <option value="Rather not say">Rather not say</option>
                        <option value="Other">Other</option>
                      </select>
                      :
                      <span>{el.gender}</span>
                    }
                  </div>
                  <div className='flex-col w-30'>
                    <span className='title'>Country</span>
                    {editingmode === el.id ? <input placeholder='Enter Country' className='input-box' name='country'
                      onChange={(e) => handleInputChange(e)} type='text' value={editFields.country} />
                      :
                      <span>{el.country}</span>
                    }
                    {errormsg && <span className='errormsg'>{errormsg.country}</span>}
                  </div>
                </div>
                <div className='flex-col'>
                  <span className='title'>Description</span>
                  {editingmode === el.id ? <textarea onChange={(e) => handleInputChange(e)}
                    value={editFields.description} id="" name="description" rows="5" cols="50">
                    {editFields.description}
                  </textarea>
                    :
                    <p>{el.description}</p>
                  }
                </div>
                <div className='flex-end'>
                  {editingmode === el.id ?
                    <>
                      <XCircleIcon style={{ stroke: 'red', fill: 'white', marginRight: '10px' }} width={22} height={22} onClick={() => {
                        setEditingMode(false)
                        setDropdown(el.first)
                      }} />
                      <CheckCircleIcon onClick={() => onSubmitUser(el.id)} style={{ stroke: 'green', fill: 'white' }} width={22} height={22} />
                    </>
                    :
                    <>
                      <PencilIcon onClick={() => toggleEditingMode(el.id)} width={18} height={18}
                        style={{
                          stroke: "blue", fill: 'white', marginRight: '10px'
                        }} />
                      <TrashIcon width={18} height={18} style={{ stroke: "red", fill: 'white' }} onClick={() => OpenDialog(el.id)} />
                    </>
                  }
                </div>
                <DialogComponent deletemode={deletemode} data={el} CloseDialog={CloseDialog} deleteUser={() => deleteUser(el.id)} />
              </div>
            </div>
          </a>
        ))
      )
      }
    </div >
  );
}

export default App;
