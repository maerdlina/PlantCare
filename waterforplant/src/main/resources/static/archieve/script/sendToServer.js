// Базовый URL для API
const API_BASE_URL = 'https://26bd90d641a5.ngrok-free.app'; // Замените на ваш ngrok URL

// DOM элементы
const plantsContainer = document.getElementById('plantsContainer');
const plantSelect = document.getElementById('plantSelect');
const deletePlantSelect = document.getElementById('deletePlant');
const addPlantForm = document.getElementById('addPlantForm');
const addWateringForm = document.getElementById('addWateringForm');
const searchPlantForm = document.getElementById('searchPlantForm');
const deletePlantBtn = document.getElementById('deletePlantBtn');
const updatePlantForm = document.getElementById('updatePlantForm');
const updatePlantModal = document.getElementById('updatePlantModal');
const closeModalBtn = document.querySelector('.close-modal');

// Загрузить растения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadPlants();
    loadPlantsForSelect();
});

// Загрузка растений для выпадающих списков
async function loadPlantsForSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/plants`);
        if (!response.ok) throw new Error('Ошибка загрузки растений');

        const plants = await response.json();

        // Обновить выпадающий список для полива
        plantSelect.innerHTML = '';
        plants.forEach(plant => {
            const option = document.createElement('option');
            option.value = plant.id;
            option.textContent = plant.plant_name;
            plantSelect.appendChild(option);
        });

        // Обновить выпадающий список для удаления
        deletePlantSelect.innerHTML = '';
        plants.forEach(plant => {
            const option = document.createElement('option');
            option.value = plant.plant_name;
            option.textContent = plant.plant_name;
            deletePlantSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Ошибка при загрузке растений:', error);
        showMessage('addWateringMessage', 'Ошибка загрузки растений', 'error');
    }
}

// Загрузка растений для отображения
async function loadPlants() {
    try {
        plantsContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i><p>Загрузка растений...</p></div>';

        const response = await fetch(`${API_BASE_URL}/plants`);
        if (!response.ok) throw new Error('Ошибка загрузки растений');

        const plants = await response.json();

        if (plants.length === 0) {
            plantsContainer.innerHTML = '<div class="message">У вас пока нет растений. Добавьте первое растение!</div>';
            return;
        }

        let plantsHTML = '';

        plants.forEach(plant => {
            const lastWatering = plant.wateringTimes && plant.wateringTimes.length > 0
                ? new Date(plant.wateringTimes[0].last_watering).toLocaleDateString()
                : 'ещё не поливали';

            plantsHTML += `
                <div class="plant-item" data-id="${plant.id}">
                    <div class="plant-icon">
                        <i class="fas fa-seedling"></i>
                    </div>
                    <div class="plant-info">
                        <h4>${plant.plant_name}</h4>
                        <div class="plant-meta">
                            <span>${plant.plant_type}</span>
                            <span>Посажен: ${new Date(plant.date_of_birth).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="watering-date">
                        Последний полив: ${lastWatering}
                    </div>
                    <div class="plant-actions">
                        <button class="btn action-btn" onclick="openUpdateModal(${plant.id}, '${plant.plant_name}', '${plant.plant_type}', '${plant.date_of_birth}')">
                            <i class="fas fa-edit"></i> Изменить
                        </button>
                        <button class="btn btn-delete action-btn" onclick="deletePlant('${plant.plant_name}')">
                            <i class="fas fa-trash"></i> Удалить
                        </button>
                    </div>
                </div>
            `;
        });

        plantsContainer.innerHTML = plantsHTML;

    } catch (error) {
        console.error('Ошибка при загрузке растений:', error);
        plantsContainer.innerHTML = '<div class="message error">Ошибка загрузки растений</div>';
    }
}

// Добавление растения
addPlantForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const plant = {
        plant_name: document.getElementById('plantName').value,
        plant_type: document.getElementById('plantType').value,
        date_of_birth: document.getElementById('birthDate').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/plants/addPlant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(plant)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при добавлении растения');
        }

        const newPlant = await response.json();
        showMessage('addPlantMessage', `Растение "${newPlant.plant_name}" успешно добавлено!`, 'success');
        addPlantForm.reset();

        // Обновить списки растений
        loadPlants();
        loadPlantsForSelect();

    } catch (error) {
        console.error('Ошибка при добавлении растения:', error);
        showMessage('addPlantMessage', error.message, 'error');
    }
});

// Добавление полива
addWateringForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const plantId = plantSelect.value;
    const watering = {
        last_watering: document.getElementById('wateringDate').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/watering/addWateringTime?id=${plantId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(watering)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при добавлении полива');
        }

        const newWatering = await response.json();
        showMessage('addWateringMessage', 'Полив успешно добавлен!', 'success');
        addWateringForm.reset();

        // Обновить список растений
        loadPlants();

    } catch (error) {
        console.error('Ошибка при добавлении полива:', error);
        showMessage('addWateringMessage', error.message, 'error');
    }
});

// Поиск растения по имени
searchPlantForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const plantName = document.getElementById('searchPlant').value;

    try {
        const response = await fetch(`${API_BASE_URL}/plants/seePlantByName?name=${encodeURIComponent(plantName)}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Растение не найдено');
        }

        const plant = await response.json();
        const searchResults = document.getElementById('searchResults');

        searchResults.innerHTML = `
            <div class="message success">
                Найдено растение: <strong>${plant.plant_name}</strong><br>
                Тип: ${plant.plant_type}<br>
                Дата посадки: ${new Date(plant.date_of_birth).toLocaleDateString()}
            </div>
        `;

    } catch (error) {
        console.error('Ошибка при поиске растения:', error);
        showMessage('searchResults', error.message, 'error');
    }
});

// Удаление растения
deletePlantBtn.addEventListener('click', async () => {
    const plantName = deletePlantSelect.value;
    if (!plantName) {
        showMessage('deleteMessage', 'Выберите растение для удаления', 'error');
        return;
    }

    if (!confirm(`Вы уверены, что хотите удалить растение "${plantName}"?`)) return;

    try {
        const response = await fetch(`${API_BASE_URL}/plants/deleteByName?name=${encodeURIComponent(plantName)}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при удалении растения');
        }

        const result = await response.text();
        showMessage('deleteMessage', `Растение "${plantName}" успешно удалено`, 'success');

        // Обновить списки растений
        loadPlants();
        loadPlantsForSelect();

    } catch (error) {
        console.error('Ошибка при удалении растения:', error);
        showMessage('deleteMessage', error.message, 'error');
    }
});

// Обновление растения
updatePlantForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const plantId = document.getElementById('updatePlantId').value;
    const params = new URLSearchParams({
        id: plantId,
        plant_name: document.getElementById('updatePlantName').value,
        plant_type: document.getElementById('updatePlantType').value,
        date_of_birth: document.getElementById('updateBirthDate').value
    });

    try {
        const response = await fetch(`${API_BASE_URL}/plants/updatePlantByName?${params}`, {
            method: 'PUT'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка при обновлении растения');
        }

        const updatedPlant = await response.json();
        showMessage('updateMessage', `Растение "${updatedPlant.plant_name}" успешно обновлено`, 'success');

        // Закрыть модальное окно через 1.5 секунды
        setTimeout(() => {
            updatePlantModal.style.display = 'none';
            updatePlantForm.reset();

            // Обновить списки растений
            loadPlants();
            loadPlantsForSelect();
        }, 1500);

    } catch (error) {
        console.error('Ошибка при обновлении растения:', error);
        showMessage('updateMessage', error.message, 'error');
    }
});

// Функция для открытия модального окна обновления
window.openUpdateModal = function(id, name, type, dateOfBirth) {
    document.getElementById('updatePlantId').value = id;
    document.getElementById('updatePlantName').value = name;
    document.getElementById('updatePlantType').value = type;
    document.getElementById('updateBirthDate').value = dateOfBirth.split('T')[0];

    updatePlantModal.style.display = 'flex';
    document.getElementById('updateMessage').innerHTML = '';
}

// Закрытие модального окна
closeModalBtn.addEventListener('click', () => {
    updatePlantModal.style.display = 'none';
    updatePlantForm.reset();
});

// Закрытие модального окна при клике вне его
window.addEventListener('click', (e) => {
    if (e.target === updatePlantModal) {
        updatePlantModal.style.display = 'none';
        updatePlantForm.reset();
    }
});

// Удаление растения по имени (для кнопок в списке)
window.deletePlant = function(name) {
    if (!confirm(`Вы уверены, что хотите удалить растение "${name}"?`)) return;

    fetch(`${API_BASE_URL}/plants/deleteByName?name=${encodeURIComponent(name)}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка при удалении растения');
            return response.text();
        })
        .then(result => {
            alert(`Растение "${name}" успешно удалено`);
            loadPlants();
            loadPlantsForSelect();
        })
        .catch(error => {
            console.error('Ошибка при удалении растения:', error);
            alert(`Ошибка: ${error.message}`);
        });
}

// Показать сообщение
function showMessage(elementId, text, type) {
    const messageElement = document.getElementById(elementId);
    messageElement.textContent = text;
    messageElement.className = 'message';
    messageElement.classList.add(type);

    // Очистить сообщение через 5 секунд
    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.className = 'message';
    }, 5000);
}

// Навигация
document.getElementById('showPlantsBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.plant-list').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('addPlantBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.card:first-child').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('addWateringBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.card:nth-child(2)').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('getStartedBtn').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.actions').scrollIntoView({ behavior: 'smooth' });
});