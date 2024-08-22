import React, { useEffect, useState } from 'react';
import './styles.css'

function Table () {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
  
    useEffect(() => {
      //'https://dummyjson.com/users/filter?key=hair.color&value=Brown'
      // 'https://dummyjson.com/users'
      fetch('https://dummyjson.com/users/filter?key=firstName&value=Emma')
        .then(res => res.json())
        .then(data => {
          setUsers(data.users);
          setFilteredUsers(data.users); // Изначально показываем всех пользователей
        })
        .catch(err => console.error(err));
    }, []);
  
    useEffect(() => {
      if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = users.filter(user =>
          user.firstName.toLowerCase().includes(lowercasedTerm) ||
          user.LastName.toLowerCase().includes(lowercasedTerm) ||
          user.age.toString().includes(lowercasedTerm) ||
          user.gender.toLowerCase().includes(lowercasedTerm) ||
          user.phone.includes(lowercasedTerm) ||
          user.address.city.toLowerCase().includes(lowercasedTerm) ||
          user.address.address.toLowerCase().includes(lowercasedTerm)
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(users);
      }
    }, [searchTerm, users]);

    return (
    <div className='content'>
      <h1>Таблица пользователей</h1>
        <input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='input-find'
        />
        <table className='table'>
            <thead>
                <tr>
                    <th>ФИО</th>
                    <th>Возраст</th>
                    <th>Пол</th>
                    <th>Номер телефона</th>
                    <th>Адрес</th>
                </tr>
            </thead>
            <tbody> 
            {filteredUsers.map(user => (
                <tr key={user.id}>
                <td>{`${user.firstName} ${user.lastName} ${user.maidenName}`}</td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td>{user.phone}</td>
                <td>{`${user.address.city}, ${user.address.address}`}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
  );
}

export default Table