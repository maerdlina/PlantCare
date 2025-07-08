// plants.js - работа с растениями (обновлённая версия)
const API_BASE_URL = 'https://26bd90d641a5.ngrok-free.app';

document.addEventListener('DOMContentLoaded', function() {
    // Загрузка растений при старте
    loadPlants();

    // Обработчики форм
    initAddPlantForm();
    initAddWateringForm();
    initSearchForm();
    initDeleteButton();
    initUpdateForm();

    // Навигация
    initNavigation();

    // Модальное окно
    initModal();
});

async function loadPlants() {
    try {
        const container = document.getElementById('plantsContainer');
        if (!container) return;

        container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>Загрузка растений...</p></div>';

        const response = await fetch(`${API_BASE_URL}/plants`);
        if (!response.ok) throw new Error('Ошибка загрузки растений');

        const plants = await response.json();

        if (plants.length === 0) {
            container.innerHTML = '<div class="message">У вас пока нет растений. Добавьте первое растение!</div>';
            return;
        }

        renderPlants(plants);
        populatePlantSelects(plants);

    } catch (error) {
        console.error('Ошибка при загрузке растений:', error);
        showMessage('plantsContainer', 'Ошибка загрузки растений', 'error');
    }
}

function renderPlants(plants) {
    const container = document.getElementById('plantsContainer');
    if (!container) return;

    container.innerHTML = '';

    plants.forEach(plant => {
        const lastWatering = plant.wateringTimes && plant.wateringTimes.length > 0
            ? new Date(plant.wateringTimes[0].last_watering).toLocaleDateString()
            : 'ещё не поливали';

        const plantEl = document.createElement('div');
        plantEl.className = 'plant-item';
        plantEl.dataset.id = plant.id;
        plantEl.innerHTML = `
            <div class="plant-icon">
                <i class="fas fa-leaf"></i>
            </div>
            <div class="plant-info">
                <h4>${plant.plant_name}</h4>
                <div class="plant-meta">
                    <span>${plant.plant_type}</span>
                    <span>Посажен: ${formatDate(plant.date_of_birth)}</span>
                </div>
            </div>
            <div class="watering-date">
                Последний полив: ${lastWatering}
            </div>
            <div class="plant-actions">
                <button class="btn action-btn update-btn">
                    <i class="fas fa-edit"></i> Изменить
                </button>
                <button class="btn btn-delete action-btn delete-btn">
                    <i class="fas fa-trash"></i> Удалить
                </button>
            </div>
        `;

        container.appendChild(plantEl);

        // Добавляем обработчики для кнопок
        const updateBtn = plantEl.querySelector('.update-btn');
        const deleteBtn = plantEl.querySelector('.delete-btn');

        if (updateBtn) {
            updateBtn.addEventListener('click', () => {
                openUpdateModal(
                    plant.id,
                    plant.plant_name,
                    plant.plant_type,
                    plant.date_of_birth
                );
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                deletePlant(plant.plant_name);
            });
        }
    });
}

function populatePlantSelects(plants) {
    const plantSelect = document.getElementById('plantSelect');
    const deletePlantSelect = document.getElementById('deletePlant');

    if (plantSelect) {
        plantSelect.innerHTML = '';
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Выберите растение';
        plantSelect.appendChild(option);

        plants.forEach(plant => {
            const option = document.createElement('option');
            option.value = plant.id;
            option.textContent = plant.plant_name;
            plantSelect.appendChild(option);
        });
    }

    if (deletePlantSelect) {
        deletePlantSelect.innerHTML = '';
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Выберите растение';
        deletePlantSelect.appendChild(option);

        plants.forEach(plant => {
            const option = document.createElement('option');
            option.value = plant.plant_name;
            option.textContent = plant.plant_name;
            deletePlantSelect.appendChild(option);
        });
    }
}

function initAddPlantForm() {
    const form = document.getElementById('addPlantForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const plantName = document.getElementById('plantName').value;
        const plantType = document.getElementById('plantType').value;
        const birthDate = document.getElementById('birthDate').value;

        if (!plantName || !plantType || !birthDate) {
            showMessage('addPlantMessage', 'Заполните все поля', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/plants/addPlant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    plant_name: plantName,
                    plant_type: plantType,
                    date_of_birth: birthDate
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при добавлении растения');
            }

            const newPlant = await response.json();
            showMessage('addPlantMessage', `Растение "${newPlant.plant_name}" успешно добавлено!`, 'success');

            // Очистить форму
            form.reset();

            // Обновить список растений
            await loadPlants();

        } catch (error) {
            console.error('Ошибка при добавлении растения:', error);
            showMessage('addPlantMessage', error.message, 'error');
        }
    });
}

function initAddWateringForm() {
    const form = document.getElementById('addWateringForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const plantId = document.getElementById('plantSelect').value;
        const wateringDate = document.getElementById('wateringDate').value;

        if (!plantId || !wateringDate) {
            showMessage('addWateringMessage', 'Выберите растение и дату полива', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/watering/addWateringTime?id=${plantId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    last_watering: wateringDate
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка при добавлении полива');
            }

            showMessage('addWateringMessage', 'Полив успешно добавлен!', 'success');

            // Очистить форму
            form.reset();

            // Обновить список растений
            await loadPlants();

        } catch (error) {
            console.error('Ошибка при добавлении полива:', error);
            showMessage('addWateringMessage', error.message, 'error');
        }
    });
}

function initSearchForm() {
    const form = document.getElementById('searchPlantForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const searchTerm = document.getElementById('searchPlant').value;

        if (!searchTerm) {
            showMessage('searchResults', 'Введите название растения', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/plants/seePlantByName?name=${encodeURIComponent(searchTerm)}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Растение не найдено');
            }

            const plant = await response.json();
            const results = document.getElementById('searchResults');

            results.innerHTML = `
                <div class="message success">
                    Найдено растение: <strong>${plant.plant_name}</strong><br>
                    Тип: ${plant.plant_type}<br>
                    Дата посадки: ${formatDate(plant.date_of_birth)}
                </div>
            `;

        } catch (error) {
            console.error('Ошибка при поиске растения:', error);
            showMessage('searchResults', error.message, 'error');
        }
    });
}

function initDeleteButton() {
    const button = document.getElementById('deletePlantBtn');
    if (!button) return;

    button.addEventListener('click', async function() {
        const plantName = document.getElementById('deletePlant').value;

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

            showMessage('deleteMessage', `Растение "${plantName}" успешно удалено`, 'success');

            // Обновить список растений
            await loadPlants();

        } catch (error) {
            console.error('Ошибка при удалении растения:', error);
            showMessage('deleteMessage', error.message, 'error');
        }
    });
}

function initUpdateForm() {
    const form = document.getElementById('updatePlantForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const plantId = document.getElementById('updatePlantId').value;
        const plantName = document.getElementById('updatePlantName').value;
        const plantType = document.getElementById('updatePlantType').value;
        const birthDate = document.getElementById('updateBirthDate').value;

        if (!plantId || !plantName || !plantType || !birthDate) {
            showMessage('updateMessage', 'Заполните все поля', 'error');
            return;
        }

        try {
            const params = new URLSearchParams({
                id: plantId,
                plant_name: plantName,
                plant_type: plantType,
                date_of_birth: birthDate
            });

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
            setTimeout(async () => {
                closeModal();
                await loadPlants();
            }, 1500);

        } catch (error) {
            console.error('Ошибка при обновлении растения:', error);
            showMessage('updateMessage', error.message, 'error');
        }
    });
}

function initNavigation() {
    // Навигация по кнопкам
    const navHandlers = {
        showPlantsBtn: '.plant-list',
        addPlantBtn: '.card:first-child',
        addWateringBtn: '.card:nth-child(2)',
        getStartedBtn: '.actions'
    };

    for (const [btnId, selector] of Object.entries(navHandlers)) {
        const button = document.getElementById(btnId);
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(selector);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }
}

function initModal() {
    const modal = document.getElementById('updatePlantModal');
    const closeBtn = document.querySelector('.close-modal');

    if (!modal || !closeBtn) return;

    // Закрытие кнопкой
    closeBtn.addEventListener('click', closeModal);

    // Закрытие кликом вне модального окна
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function openUpdateModal(id, name, type, dateOfBirth) {
    const modal = document.getElementById('updatePlantModal');
    if (!modal) return;

    document.getElementById('updatePlantId').value = id;
    document.getElementById('updatePlantName').value = name;
    document.getElementById('updatePlantType').value = type;

    // Форматируем дату для input[type=date]
    const formattedDate = new Date(dateOfBirth).toISOString().split('T')[0];
    document.getElementById('updateBirthDate').value = formattedDate;

    document.getElementById('updateMessage').textContent = '';
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('updatePlantModal');
    if (!modal) return;

    modal.style.display = 'none';
    document.getElementById('updatePlantForm').reset();
}

function deletePlant(name) {
    if (!confirm(`Вы уверены, что хотите удалить растение "${name}"?`)) return;

    fetch(`${API_BASE_URL}/plants/deleteByName?name=${encodeURIComponent(name)}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка при удалении растения');
            return response.text();
        })
        .then(result => {
            showMessage('deleteMessage', `Растение "${name}" успешно удалено`, 'success');
            loadPlants();
        })
        .catch(error => {
            console.error('Ошибка при удалении растения:', error);
            showMessage('deleteMessage', error.message, 'error');
        });
}

function showMessage(elementId, text, type) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.textContent = text;
    element.className = 'message';
    element.classList.add(type);

    // Автоочистка сообщения (кроме модальных)
    if (!element.closest('.modal')) {
        setTimeout(() => {
            element.textContent = '';
            element.className = 'message';
        }, 5000);
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}