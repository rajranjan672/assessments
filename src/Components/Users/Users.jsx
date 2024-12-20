import React, { useEffect, useState } from 'react';
import { supabase } from '../../Supabase';
import { BellAlertIcon, CommandLineIcon, PencilIcon, QuestionMarkCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

const Users = () => {
  const [openModel, setOpenModel] = useState(false);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState({
    name: "",
    cohort: "",
    course: "",
    datejoined: "",
    lastLogin: "",
    status: "", // Initially, the status is empty
  });
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [editingUser, setEditingUser] = useState(null);

  const openEditModal = (user) => {
    setEditingUser(user); // Populate the state with the user data
    setOpenModel(true); // Open the modal
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openModelHandler = () => {
    setOpenModel(!openModel);
  };

  const fetchStudents = async () => {
    const response = await supabase.from("Users").select("*");

    if (response.error) {
      console.error("Error fetching data:", response.error);
      return;
    }

    setUsers(response.data);
    console.log(response.data);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
  
    const { name, cohort, course, datejoined, lastLogin, status, ...rest } = data;
  
    const randomStatus = status || (Math.random() < 0.5 ? 'online' : 'offline');
  
    console.log('Data to submit:', {
      studentName: name,
      Cohort: cohort,
      Courses: course,
      Lastlogin: lastLogin,
      Datejoined: datejoined,
      Status: randomStatus,
    });
  
    let formattedDateJoined = "";
    let formattedLastLogin = "";
  
    if (datejoined) {
      const date = new Date(datejoined);
      if (!isNaN(date)) {
        formattedDateJoined = date.toISOString().split('T')[0];
      } else {
        console.error("Invalid Date for Datejoined:", datejoined);
      }
    }
  
    if (lastLogin) {
      const lastLoginDate = new Date(lastLogin);
      if (!isNaN(lastLoginDate)) {
        formattedLastLogin = lastLoginDate.toISOString().split('T')[0];
      } else {
        console.error("Invalid Date for Lastlogin:", lastLogin);
      }
    }
  
    if (editingUser) {
      // If editing, update the user
      const { data: updatedData, error } = await supabase
        .from('Users')
        .update({
          StudentName: name,
          Cohort: cohort,
          Lastlogin: formattedLastLogin,
          Courses: course,
          Datejoined: formattedDateJoined,
          Status: randomStatus,
        })
        .eq('id', editingUser.id);
  
      if (error) {
        console.error('Error updating data:', error.message);
      } else {
        console.log('Data successfully updated:', updatedData);
        setOpenModel(false);
        fetchStudents();
      }
    } else {
      // If adding new user
      const { data: insertedData, error } = await supabase
        .from('Users')
        .insert([{
          StudentName: name,
          Cohort: cohort,
          Lastlogin: formattedLastLogin,
          Courses: course,
          Datejoined: formattedDateJoined,
          Status: randomStatus,
        }]);
  
      if (error) {
        console.error('Error inserting data:', error.message);
      } else {
        console.log('Data successfully inserted:', insertedData);
        setOpenModel(false);
        fetchStudents();
      }
    }
  
    setData({
      name: "",
      cohort: "",
      course: "",
      datejoined: "",
      lastLogin: "",
      status: "",
    });
  };
  

  const deleteHandler = async (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this student?");
    if (!confirmation) return;

    const { error } = await supabase
      .from('Users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error.message);
    } else {
      console.log('User successfully deleted');
      fetchStudents();
    }
  };

  // Filter users based on the search query
  const filteredUsers = users.filter(user => 
    user.StudentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="flex justify-between items-center h-full w-full">
        <div className="relative w-full max-w-xs ml-64">
          <input 
            type="search" 
            placeholder="Search" 
            className="border border-gray-200 w-full p-2 pl-12 pr-3 rounded-md"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 18l6-6M10 18l-6-6m6 6h7a9 9 0 10-7 7h7" />
          </svg>
        </div>
        <span className="flex space-x-4 ml-auto"> 
          <QuestionMarkCircleIcon className="h-6 w-6" />
          <CommandLineIcon className="h-6 w-6" />
          <BellAlertIcon className="h-6 w-6" />
        </span>
      </div>

      <div className="flex justify-center items-center h-full w-full">
        <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 w-full max-w-4xl lg:ml-64 p-4">
          <h3 className="text-2xl font-semibold text-center mb-4">Users</h3>

          <div className="text-right">
            <button 
              type="button" 
              className="text-white bg-slate-400 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
              onClick={openModelHandler}>
              + Add new Student
            </button>
          </div>

          {openModel && (
            <div id="crud-modal" tabindex="-1" aria-hidden="true" className="flex justify-content-center z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
              <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Student</h3>
                    <button 
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" 
                      data-modal-toggle="crud-modal"
                      onClick={openModelHandler}>
                      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  <form className="p-4 md:p-5" onSubmit={submitHandler}>
                    <div className="grid gap-4 mb-4 grid-cols-2">
                      <div className="col-span-2">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Student Name</label>
                        <input 
                          type="text" 
                          name="name" 
                          id="name" 
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary-500"
                          placeholder="Student Name" 
                          required 
                          value={editingUser ? editingUser.StudentName : data.name}
                          onChange={(e) => setData({...data, name: e.target.value})}
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="cohort" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cohort</label>
                        <input 
                          type="text" 
                          name="cohort" 
                          id="cohort"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:border-primary-500"
                          placeholder="Cohort" 
                          required
                          value={editingUser ? editingUser.Cohort : data.cohort}
                          onChange={(e) => setData({...data, cohort: e.target.value})}
                        />
                      </div>

                      <div className="col-span-2">
                        <label htmlFor="datejoined" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date Joined</label>
                        <input 
                          type="date" 
                          id="datejoined" 
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={editingUser ? editingUser.Datejoined : data.datejoined}
                          onChange={(e) => setData({...data, datejoined: e.target.value})}
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="lastlogin" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Login</label>
                        <input 
                          type="date" 
                          name="lastlogin" 
                          id="lastlogin"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          value={editingUser ? editingUser.Lastlogin : data.lastLogin}
                          onChange={(e) => setData({...data, lastLogin: e.target.value})}
                        />
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label htmlFor="course" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Course</label>
                        <select 
                          id="course"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          value={editingUser ? editingUser.Courses : data.course}
                          onChange={(e) => setData({...data, course: e.target.value})}
                        >
                          <option value=" ">Select course</option>
                          <option value="Science">CBSE 9 Science</option>
                          <option value="Maths">CBSE 9 Maths</option>
                          <option value="English">CBSE 9 English</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                        <div className="flex items-center space-x-4">
                          <label className="inline-flex items-center">
                            <input 
                              type="radio" 
                              name="status" 
                              value="online"
                              checked={editingUser ? editingUser.Status === 'online' : data.status === 'online'}
                              onChange={(e) => setData({...data, status: e.target.value})}
                              className="form-radio"
                            />
                            <span className="ml-2">Online</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input 
                              type="radio" 
                              name="status" 
                              value="offline"
                              checked={editingUser ? editingUser.Status === 'offline' : data.status === 'offline'}
                              onChange={(e) => setData({...data, status: e.target.value})}
                              className="form-radio"
                            />
                            <span className="ml-2">Offline</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      {editingUser ? 'Update Student' : 'Add New Student'}
                    </button>
                  </form>

                </div>
              </div>
            </div>
          )}

          <div className="relative overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Student Name</th>
                  <th scope="col" className="px-6 py-3">Cohort</th>
                  <th scope="col" className="px-6 py-3">Courses</th>
                  <th scope="col" className="px-6 py-3">Date Joined</th>
                  <th scope="col" className="px-6 py-3">Last Login</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((item) => (
                  <tr key={item.StudentName} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-transform: uppercase text-gray-900 whitespace-nowrap dark:text-white">{item.StudentName}</td>
                    <td className="px-6 py-4 text-transform: capitalize">{item.Cohort}</td>
                    <td className="px-6 py-4">{item.Courses}</td>
                    <td className="px-6 py-4">{item.Datejoined}</td>
                    <td className="px-6 py-4">{item.Lastlogin}</td>
                    <td className="px-6 py-4 text-transform: uppercase">{item.Status}</td>
                    <td className="px-6 py-4 flex">
                      <PencilIcon className='cursor-pointer' color='#4287f5'  />
                      <TrashIcon className='cursor-pointer' color='#f72a6b' onClick={() => deleteHandler(item.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
