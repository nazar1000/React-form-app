import imghe from './img.jpg';
import imgshe from './imgshe.jpg';
import './App.css';
import { useEffect, useState } from 'react';
import Axios from "axios";


function App() {
  const [formDate, setFormData] = useState("");
  const [datalist, setDatalist] = useState([]);
  const [error, setError] = useState({ downloadError: false, uploadError: false });


  useEffect(() => {
    Axios.get('http://127.0.0.1:3001/api/get').then((response) => {
      console.log(response.data);
      setDatalist(response.data);
      setError({ ...error, downloadError: false });
    }, setError({ ...error, downloadError: true }));
  }, [])


  //handles for change
  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    setFormData(values => ({ ...values, [name]: value }))


  }

  //Sends data to backEnd
  const handleSubmit = (event) => {
    event.preventDefault();
    if (error.downloadError) return;
    console.log(formDate);
    Axios.post('http://127.0.0.1:3001/api/insert', {
      first_name: formDate.first_name,
      last_name: formDate.last_name,
      date_of_birth: formDate.date_of_birth,
      email: formDate.email,
      mobile: formDate.mobile,
    })
    event.target.reset();
    console.log(event);

    setDatalist([...datalist, {
      first_name: formDate.first_name,
      last_name: formDate.last_name,
      date_of_birth: new Date(formDate.date_of_birth).toLocaleDateString(),
      email: formDate.email,
      mobile: formDate.mobile,
    }]);
  }


  const deleteData = (last_name, dob) => {
    let date_of_birth = dob.replaceAll("/", "-");
    Axios.delete(`http://127.0.0.1:3001/api/delete/${last_name}/${date_of_birth}`).then(() => {
      // console.log(response)
      // console.log((datalist) => datalist.filter(obj => obj.last_Name != last_Name));
      setDatalist(datalist.filter(obj => obj.last_name !== last_name && obj.date_of_birth !== date_of_birth))
    })
  }

  const update = (table, last_Name, date_of_birth, e) => {
    let entry = prompt("Insert updated name");
    if (entry == "" || entry == null) {
      alert("Date must be yyyy/mm/dd format, Email must be correct email format");
      return;
    }

    Axios.put(`http://127.0.0.1:3001/api/update`, {
      last_name: last_Name,
      date_of_birth: date_of_birth,
      tableName: table,
      newEntry: entry,
    }).then((status) => {
      e.target.previousSibling.innerHTML = entry;
    })
  }

  const isError = () => {
    if (error.downloadError) {
      return <h3> Connection to database failed, please try again later.</h3>
    }
  }


  return (
    <div className="App">

      <header>
        <h2>
          React form
        </h2>
      </header>

      <form onSubmit={handleSubmit}>
        <h3>Create user</h3>

        {/* <label> First name:</label> */}
        <input type="text" name="first_name" placeholder='First Name' autoFocus onChange={handleChange} required></input>

        {/* <label> Last name:</label> */}
        <input type="text" name="last_name" placeholder='Last Name' onChange={handleChange} required></input>

        {/* <label> Date of birth:</label> */}
        <input type="date" name="date_of_birth" placeholder='Date of Birth' onChange={handleChange} required></input>

        {/* <label> Email address:</label> */}
        <input type="email" name="email" placeholder='Email' onChange={handleChange} required></input>

        {/* <label> Mobile No:</label> */}
        <input type="number" name="mobile" placeholder='Mobile No' maxLength="15" onChange={handleChange} required></input>

        {/* <button type="submit">Submit</button> */}
        <button type="submit" className='button_style submit_button'>Submit</button>
      </form>
      <div className='db-list'>
        <div className='container'>
          {isError()}
          {datalist.map((val) => {
            return (
              <div className='data-list'>
                <div><img src={Math.random() > 0.5 ? imghe : imgshe}></img></div>
                <div>
                  <h4>Name:</h4>
                  <h3 >{val.first_name} {' '} {val.last_name}</h3>
                </div>
                <div>
                  <h4>Date of birth:</h4>
                  <h3 >{val.date_of_birth}</h3>
                  <button className="button_style edit_button" onClick={(e) => { update("date_of_birth", val.last_name, val.date_of_birth, e) }}>Edit</button>
                </div>
                <div>
                  <h4>Email:</h4>
                  <h3 >{val.email}</h3>
                  <button className="button_style edit_button" onClick={(e) => { update("email", val.last_name, val.date_of_birth, e) }}>Edit</button>
                </div>
                <div>
                  <h4>Mobile No:</h4>
                  <h3>{val.mobile}</h3>
                  <button className="button_style edit_button" onClick={(e) => { update("mobile", val.last_name, val.date_of_birth, e) }}>Edit</button>
                </div>
                <button className='button_style submit_button' onClick={(e) => { deleteData(val.last_name, val.date_of_birth, e) }}>Delete</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
