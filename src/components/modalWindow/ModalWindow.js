import './styles.css';

const ModalWindow = ({ isOpen, onClose, user }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Информация о пользователе</h2>
                <p><strong>ФИО:</strong> {`${user.firstName} ${user.lastName} ${user.maidenName}`}</p>
                <p><strong>Возраст:</strong> {user.age}</p>
                <p><strong>Адрес:</strong> {`${user.address.city}, ${user.address.address}`}</p>
                <p><strong>Рост:</strong> {user.height}</p>
                <p><strong>Вес:</strong> {user.weight}</p>
                <p><strong>Телефон:</strong> {user.phone}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
};

export default ModalWindow;