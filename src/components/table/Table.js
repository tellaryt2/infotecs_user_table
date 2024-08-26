import React, { useEffect, useState } from 'react';
import './styles.css'
import ModalWindow from '../modalWindow/ModalWindow';

function Table () {

    const [users, setUsers] = useState([]); //Список пользователей
    const [filteredUsers, setFilteredUsers] = useState([]); //Отфильтрованный список пользователей
    const [searchTerm, setSearchTerm] = useState(''); //Поиск по ФИО
    const [addressTerm, setAddressTerm] = useState(''); //Поиск по адресу
    const [ageTerm, setAgeTerm] = useState(''); //Поиск по возрасту
    const [phoneTerm, setPhoneTerm] = useState(''); //Поиск по телефону
    const [url, setUrl] = useState('https://dummyjson.com/users/?limit=250'); //ссылка для получения запроса
    const [gender, setGender] = useState(''); //фильтр для выбора пола
    const [sortBy, setSortBy] = useState(''); //Поле по которому сортируются пользователи
    const [order, setOrder] = useState('asc'); //Тип сортировки
    const [selectedUser, setSelectedUser] = useState(null); //Выбранный пользователь в таблице
    const [isModalOpen, setIsModalOpen] = useState(false); //Флаг для модального окна
    const [isLoading, setIsLoading] = useState(false);  //Флаг для сообщения загрузки данных 
    const [errorMessage, setErrorMessage] = useState(''); //Сообщение с ошибкой

    /**
     * Обновление отображения таблицы при фильтрации пользователей по полу
     */
    useEffect(() => {
        if (gender) {
            setUrl(`https://dummyjson.com/users/filter?limit=250&key=gender&value=${gender}`);
        } else {
            setUrl('https://dummyjson.com/users/?limit=250');
        }
    }, [gender]);

    /**
     * получение данных по запросу через API
     */
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); 
            setErrorMessage(''); 

            try {
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error(`Ошибка: ${res.status} ${res.statusText}`);
                }
                const data = await res.json();
                setUsers(data.users);
            } catch (error) {
                console.error(error);
                setErrorMessage('Не удалось загрузить пользователей. Пожалуйста, попробуйте позже.');
            } finally {
                setIsLoading(false); 
            }
        };
        fetchData();
    }, [url]);

    /**
     * Обновление отображения таблицы при фильтрации пользователей
     */
    useEffect(() => {
        filterUsers(searchTerm, addressTerm, ageTerm, phoneTerm);
    }, [users, searchTerm, addressTerm, ageTerm, phoneTerm, gender]);

    /**
     * обновление отображения таблицы после сортировки
     */
    useEffect(() => {
        updateUrl()
        filterUsers(searchTerm, addressTerm, ageTerm, phoneTerm); // Ensure filtering is applied after sorting
    }, [sortBy, order]);

    /**
     * Обновление запроса  (&sortBy если необходим отсортированный массив)
     */
    const updateUrl = () => {
        let newUrl = 'https://dummyjson.com/users/?limit=250';
        if (sortBy) {
            newUrl += `&sortBy=${sortBy}&order=${order}`;
        }
        setUrl(newUrl);
    };

    /**
     * Обработчик строки поиска по ФИО
     * @param {*} event 
     */
    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    /**
     * Обработчик строки поиска по адресу
     * @param {*} event 
     */
    const handleAddressSearch = (event) => {
        setAddressTerm(event.target.value.toLowerCase());
    };

    /**
     * Обработчик строки поиска по возрасту
     * @param {*} event 
     */
    const handleAgeSearch = (event) => {
        setAgeTerm(event.target.value);
    };

    /**
     * Обработчик строки поиска по телефону
     * @param {*} event 
     */
    const handlePhoneSearch = (event) => {
        setPhoneTerm(event.target.value);
    };

    /**
     * Обработчик выбора пола
     * @param {*} event 
     */
    const handleGenderChange = (event) => {
        const { value } = event.target;
        setGender(gender === value ? '' : value);
    };

    /**
     * Фильтрация массива пользователей
     * @param {*} nameTerm ФИО в поиске
     * @param {*} addrTerm адрес в поиске
     * @param {*} ageTerm возраст в поиске
     * @param {*} phoneTerm телефон в поиске
     */
    const filterUsers = (nameTerm, addrTerm, ageTerm, phoneTerm) => {
        const filtered = users.filter(user => {
            const fullName = `${user.firstName} ${user.lastName} ${user.maidenName}`.toLowerCase();
            const address = `${user.address.city} ${user.address.address}`.toLowerCase();
            const ageMatch = ageTerm ? user.age === Number(ageTerm) : true;
            const phone = `${user.phone}`.toLowerCase();

            const genderMatch = gender ? user.gender.toLowerCase() === gender : true;

            return fullName.includes(nameTerm) && 
                   address.includes(addrTerm) && 
                   ageMatch && 
                   phone.includes(phoneTerm) && 
                   genderMatch;
        });

        //сортировка по адресу
        if (sortBy === 'address.address') {
            filtered.sort((a, b) => {
                const addressA = a.address.city.toLowerCase();
                const addressB = b.address.city.toLowerCase();
                if (order === 'asc') {
                    return addressA.localeCompare(addressB);
                } else {
                    return addressB.localeCompare(addressA);
                }
            });
        }
        setFilteredUsers(filtered);
    };

    /**
     * реализация сортировки
     * @param {*} field поле по которому пользователи сортируются
     * @param {*} orderType тип сортировки
     * @returns 
     */
    const handleSort = (field, orderType) => {
        if (field == "isNotSort") {
            setSortBy('');
            setOrder('asc');
            return;
        }
        if (sortBy === field && order === orderType) {
            setSortBy('');
            setOrder('asc');
        } else {
            setSortBy(field);
            setOrder(orderType);
        }
    };

    /**
     * Обработчик вызова модального окна пользователя
     * @param {*} user пользователь
     */
    const handleRowClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    /**
     * Обработчик закрытия модального окна
     */
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    return (
    <div className='content'>
    {errorMessage && <div className="error-message">{errorMessage}</div>}
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
            <input
                type="text"
                name="phone"
                placeholder="Телефон"
                value={phoneTerm}
                onChange={handlePhoneSearch}
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
        {isLoading && <div className="loading-message">Загрузка данных...</div>}
        <table className='table'>
            <thead>
                <tr>
                    <th>
                        <div className='table-title'>
                            ФИО
                            <button onClick={() => handleSort('firstName', 'asc')}>Сорт. по возрастанию</button>
                            <button onClick={() => handleSort('firstName', 'desc')}>Сорт. по убыванию</button>
                            <button onClick={() => handleSort('isNotSort', '')}>Без сорт.</button>
                        </div>
                    </th>
                    <th>
                        <div className='table-title'>
                            Возраст
                            <button onClick={() => handleSort('age', 'asc')}>Сорт. по возрастанию</button>
                            <button onClick={() => handleSort('age', 'desc')}>Сорт. по убыванию</button>
                            <button onClick={() => handleSort('isNotSort', '')}>Без сорт.</button>
                        </div>
                    </th>
                    <th>
                        <div className='table-title'>
                            Пол
                            <button onClick={() => handleSort('gender', 'asc')}>Сорт. по возрастанию</button>
                            <button onClick={() => handleSort('gender', 'desc')}>Сорт. по убыванию</button>
                            <button onClick={() => handleSort('isNotSort', '')}>Без сорт.</button>
                        </div>
                    </th>
                    <th>
                        Номер телефона
                    </th>
                    <th>
                        <div className='table-title'>   
                            Адрес
                            <button onClick={() => handleSort('address.address', 'asc')}>Сорт. по возрастанию</button>
                            <button onClick={() => handleSort('address.address', 'desc')}>Сорт. по убыванию</button>
                            <button onClick={() => handleSort('isNotSort', '')}>Без сорт.</button>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody> 
            {filteredUsers.map(user => (
                <tr key={user.id} onClick={() => handleRowClick(user)}>
                <td>{`${user.firstName} ${user.lastName} ${user.maidenName}`}</td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td>{user.phone}</td>
                <td>{`${user.address.city}, ${user.address.address}`}</td>
                </tr>
            ))}
            </tbody>
        </table>
        <ModalWindow isOpen={isModalOpen} onClose={closeModal} user={selectedUser} />
    </div>
  );
}

export default Table