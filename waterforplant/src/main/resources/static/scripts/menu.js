// menu.js - управление мобильным меню
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!mobileMenuToggle || !mobileMenu) return;

    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');

        // Меняем иконку при открытии/закрытии
        const icon = mobileMenuToggle.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });

    // Закрытие меню при клике вне его области
    document.addEventListener('click', function(event) {
        if (mobileMenu.classList.contains('active') &&
            !mobileMenu.contains(event.target) &&
            !mobileMenuToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });

    // Закрытие меню при прокрутке
    window.addEventListener('scroll', function() {
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Связываем кнопки мобильного меню с основными
    linkMobileButton('showPlantsBtnMobile', 'showPlantsBtn');
    linkMobileButton('addPlantBtnMobile', 'addPlantBtn');
    linkMobileButton('addWateringBtnMobile', 'addWateringBtn');

    function linkMobileButton(mobileId, desktopId) {
        const mobileBtn = document.getElementById(mobileId);
        const desktopBtn = document.getElementById(desktopId);

        if (mobileBtn && desktopBtn) {
            mobileBtn.addEventListener('click', function(e) {
                e.preventDefault();
                desktopBtn.click();
                closeMobileMenu();
            });
        }
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    }
});