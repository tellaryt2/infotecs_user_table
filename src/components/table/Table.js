import React, { useEffect, useState } from 'react';
import './styles.css'

function Table () {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [addressTerm, setAddressTerm] = useState('');
    const [ageTerm, setAgeTerm] = useState('');

    // useEffect(() => {
    //   //'https://dummyjson.com/users/filter?key=hair.color&value=Brown'
    //   // 'https://dummyjson.com/users'
    //   // 'https://dummyjson.com/users/filter?limit=250&sortBy=age&order=desc&key=age&value=32&'
    //   fetch('https://dummyjson.com/users/?limit=250')
    //     .then(res => res.json())
    //     .then(data => {
    //       setUsers(data.users);
    //       setFilteredUsers(data.users); // Изначально показываем всех пользователей
    //     })
    //     .catch(err => console.error(err));
    // }, []);

    const [gender, setGender] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [gender]);

    const fetchUsers = () => {
        const url = gender
            ? `https://dummyjson.com/users/filter?limit=250&key=gender&value=${gender}`
            : 'https://dummyjson.com/users/?limit=250';

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setUsers(data.users);
                filterUsers(searchTerm, addressTerm, ageTerm); // Фильтруем после получения данных
            })
            .catch(err => console.error(err));
    };

    const handleSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        filterUsers(term, addressTerm, ageTerm);
    };

    const handleAddressSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setAddressTerm(term);
        filterUsers(searchTerm, term, ageTerm);
    };

    const handleAgeSearch = (event) => {
        const term = event.target.value.toLowerCase();
        setAgeTerm(term);
        filterUsers(searchTerm, addressTerm, term);
    };

    const handleGenderChange = (event) => {
        const { value } = event.target;
        if (value === gender) {
            setGender(''); // Сбросить выбор, если выбранный чекбокс отключен
        } else {
            setGender(value); // Установить выбранный пол
        }
    };

    const filterUsers = (nameTerm, addrTerm, ageTerm) => {
        const filtered = users.filter(user => {
            const fullName = `${user.firstName} ${user.lastName} ${user.maidenName}`.toLowerCase();
            const address = `${user.address.city} ${user.address.address}`.toLowerCase();
            const ageMatch = ageTerm ? user.age === Number(ageTerm) : true;; // Проверяем возраст только если он введен

            return fullName.includes(nameTerm) && address.includes(addrTerm) && ageMatch;
        });
        setFilteredUsers(filtered);
    };

    return (
    <div className='content'>
      <h1>Таблица пользователей</h1>
      <div className='input-filters'>
            <input
                type="text"
                name="fullName"
                placeholder="ФИО"
                value={searchTerm}
                onChange={handleSearch}
            />
            <input
                type="text"
                name="address"
                placeholder="Адрес"
                value={addressTerm}
                onChange={handleAddressSearch}
            />
            <input
                type="number"
                name="age"
                placeholder="Возраст"
                value={ageTerm}
                onChange={handleAgeSearch}
            />
             <div className="gender-filters">
                    <label>
                        <input
                            type="checkbox"
                            value="male"
                            checked={gender === 'male'}
                            onChange={handleGenderChange}
                        />
                        Male
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="female"
                            checked={gender === 'female'}
                            onChange={handleGenderChange}
                        />
                        Female
                    </label>
                </div>
        </div>
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


//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
    
//     // Состояние для фильтров
//     const [filters, setFilters] = useState({
//         fullName: '',
//         gender: '',
//         birthYear: '',
//         address: ''
//     });

//     useEffect(() => {
//           fetch('https://dummyjson.com/users/?limit=250')
//             .then(res => res.json())
//             .then(data => {
//               setUsers(data.users);
//               setFilteredUsers(data.users); // Изначально показываем всех пользователей
//               console.log(data.users)
//             })
//             .catch(err => console.error(err));
//         }, []);

    // useEffect(() => {
    //     // Функция для получения данных пользователей
    //     const fetchUsers = async () => {
    //         const { fullName, gender, birthYear, address } = filters;
    //         let query = 'https://dummyjson.com/users/?limit=250';

    //         // Добавляем параметры запроса в зависимости от введенных значений
    //         if (fullName) {
    //             query += `&key=fullName&value=${fullName}`;
    //         }
    //         if (gender) {
    //             query += `&key=gender&value=${gender}`;
    //         }
    //         if (birthYear) {
    //             query += `&key=age&value=${birthYear}`;
    //         }
    //         if (address) {
    //             query += `&key=address&value=${address}`;
    //         }

    //         // Проверяем, есть ли хотя бы один ключ в запросе
    //         if (!fullName && !gender && !birthYear && !address) {
    //             alert('Пожалуйста, введите хотя бы одно значение для фильтрации.');
    //             return;
    //         }

    //         try {
    //             const response = await fetch(query);
    //             if (!response.ok) throw new Error('Ошибка сети');
    //             const data = await response.json();
    //             setUsers(data.users || []); // Устанавливаем пользователей или пустой массив
    //             setFilteredUsers(data.users || []);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };

    //     fetchUsers();
    // }, [filters]); // Запрос выполняется при изменении фильтров

    // Обработчик изменения инпутов
//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilters(prevFilters => ({
//             ...prevFilters,
//             [name]: value
//         }));
//     };

//     return (
//         <div className='content'>
//             <h1>Таблица пользователей</h1>
            
//             <div className='filters'>
//                 <input 
//                     type="text" 
//                     name="fullName" 
//                     placeholder="ФИО" 
//                     value={filters.fullName} 
//                     onChange={handleFilterChange} 
//                 />
//                 <input 
//                     type="text" 
//                     name="gender" 
//                     placeholder="Пол" 
//                     value={filters.gender} 
//                     onChange={handleFilterChange} 
//                 />
//                 <input 
//                     type="text" 
//                     name="birthYear" 
//                     placeholder="Год рождения" 
//                     value={filters.birthYear} 
//                     onChange={handleFilterChange} 
//                 />
//                 <input 
//                     type="text" 
//                     name="address" 
//                     placeholder="Адрес" 
//                     value={filters.address} 
//                     onChange={handleFilterChange} 
//                 />
//             </div>

//             <table className='table'>
//                 <thead>
//                     <tr>
//                         <th>ФИО</th>
//                         <th>Возраст</th>
//                         <th>Пол</th>
//                         <th>Номер телефона</th>
//                         <th>Адрес</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                 {filteredUsers.map(user => (
//                 <tr key={user.id}>
//                 <td>{`${user.firstName} ${user.lastName} ${user.maidenName}`}</td>
//                 <td>{user.age}</td>
//                 <td>{user.gender}</td>
//                 <td>{user.phone}</td>
//                 <td>{`${user.address.city}, ${user.address.address}`}</td>
//                 </tr>
//             ))}
//             </tbody>
//         </table>
//     </div>
//   );
}

export default Table