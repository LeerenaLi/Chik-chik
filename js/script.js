'use strict';

const API_URL = 'https://universal-silver-trigonometry.glitch.me/';

/*
Доступные методы:
GET /api - получить список услуг
GET /api?service={n} - получить список барберов
GET /api?spec={n} - получить список месяца работы барбера
GET /api?spec={n}&month={n} - получить список дней работы барбера
GET /api?spec={n}&month={n}&day={n} - получить список свободных часов барбера
POST /api/order - оформить заказ
*/

const addPreload = (elem) => {
    elem.classList.add('preload');
};

const removePreload = (elem) => {
    elem.classList.remove('preload');
};

const startSlider = () => {
    const sliderItems = document.querySelectorAll('.slider__item');
    const sliderList = document.querySelector('.slider__list');
    const prevBtn = document.querySelector('.slider__arrow_left');
    const nextBtn = document.querySelector('.slider__arrow_right');

    let activeSlide = 1;
    let position = 0;

    const checkSlider = () => {
        if ((activeSlide + 2 === sliderItems.length &&
                document.documentElement.offsetWidth > 560) ||
                activeSlide === sliderItems.length) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = '';
        }

        if (activeSlide === 1) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = '';
        }
    };
    checkSlider();

    const prevSlide = () => {
        sliderItems[activeSlide]?.classList.remove('slider__item_active');

        position = -sliderItems[0].clientWidth * (activeSlide - 2);

        sliderList.style.transform = `translateX(${position}px)`;

        activeSlide -= 1;
        sliderItems[activeSlide]?.classList.add('slider__item_active');
        checkSlider();
    };

    const nextSlide = () => {
        sliderItems[activeSlide]?.classList.remove('slider__item_active');

        position = -sliderItems[0].clientWidth * activeSlide;

        sliderList.style.transform = `translateX(${position}px)`;

        activeSlide += 1;
        sliderItems[activeSlide]?.classList.add('slider__item_active');
        checkSlider();
    };

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    window.addEventListener('resize', () => {
        setTimeout(() => {
            if (activeSlide + 2 > sliderItems.length && document.documentElement.offsetWidth > 560) {
                activeSlide = sliderItems.length - 2;
                sliderItems[activeSlide]?.classList.add('slider__item_active');
            }

            position = -sliderItems[0].clientWidth * (activeSlide - 1);
            sliderList.style.transform = `translateX(${position}px)`;
            checkSlider();
        }, 100);
    });
};

const initSlider = () => {
    const slider = document.querySelector('.slider');
    const sliderContainer = document.querySelector('.slider__container');

    sliderContainer.style.display = 'none';

    addPreload(slider);

    window.addEventListener('load', () => {
        sliderContainer.style.display = '';
        removePreload(slider);

        startSlider();
    });
};


const renderPrice = (wrapper, data) => {
    data.forEach((item) => {
        const priceItem = document.createElement('li');
        priceItem.classList.add('price__item');

        priceItem.innerHTML = `
            <span class="price__item-title">${item.name}</span>
            <span class="price__item-count">${item.price} руб</span>
        `;

        wrapper.append(priceItem);
    });
};

const renderService = (wrapper, data) => {
    const lables = data.map(item => {
        const label = document.createElement('label');
        label.classList.add('radio');
        label.innerHTML = `
            <input class="radio__input" type="radio" name="service" value = "${item.id}">
            <span class="radio__label">${item.name}</span>
        `;
        return label;
    });

    wrapper.append(...lables);
};

const initService = () => {
    const priceList = document.querySelector('.price__list');
    priceList.textContent = '';

    addPreload(priceList);

    const reserveFieldsetService = document.querySelector('.reserve__fieldset_service');
    reserveFieldsetService.innerHTML = '<legend class="reserve__legend">Услуга</legend>';
    addPreload(reserveFieldsetService);


    fetch(`${API_URL}/api`)
            .then(response => response.json())
            .then(data => {
                renderPrice(priceList, data);
                removePreload(priceList);
                return data;
            })
            .then(data => {
                renderService(reserveFieldsetService, data);
                removePreload(reserveFieldsetService);
            });
};

const addDisabled = (arr) => {
    arr.forEach(elem => {
        elem.disabled = true;
    });
};

const removeDisabled = (arr) => {
    arr.forEach(elem => {
        elem.disabled = false;
    });
};

const renderSpec = (wrapper, data) => {
    const lables = data.map(item => {
        const label = document.createElement('label');
        label.classList.add('radio');
        label.innerHTML = `
        <input class="radio__input radio__input_spec" type="radio" name="spec" value="${item.id}">
        <span class="radio__label radio__label_spec"
            style="--bg-image: url(${API_URL}${item.img})">${item.name}</span>
        `;
        return label;
    });

    wrapper.append(...lables);
};

const renderMonth = (wrapper, data) => {
    const lables = data.map(month => {
        const label = document.createElement('label');
        const formatDate = new Intl.DateTimeFormat('ru-Ru', {
            month: 'long',
        }).format(new Date(month));
        label.classList.add('radio');
        label.innerHTML = `
            <input class="radio__input" type="radio" name="month" value="${month}">
            <span class="radio__label">${formatDate}</span>
        `;
        return label;
    });

    wrapper.append(...lables);
};

const renderDay = (wrapper, data, month) => {
    const lables = data.map(day => {
        const label = document.createElement('label');
        const formatDate = new Intl.DateTimeFormat('ru-Ru', {
            month: 'long', day: 'numeric',
        }).format(new Date(`${month}/${day}`));
        label.classList.add('radio');
        label.innerHTML = `
            <input class="radio__input" type="radio" name="day" value="${day}">
            <span class="radio__label">${formatDate}</span>
        `;
        return label;
    });

    wrapper.append(...lables);
};

const renderTime = (wrapper, data) => {
    const lables = data.map(time => {
        const label = document.createElement('label');
        label.classList.add('radio');
        label.innerHTML = `
            <input class="radio__input" type="radio" name="time" value="${time}">
            <span class="radio__label">${time}</span>
        `;
        return label;
    });

    wrapper.append(...lables);
};


const initReserve = () => {
    const reserveForm = document.querySelector('.reserve__form');

    const {fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn} = reserveForm;

    addDisabled([fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn]);

    reserveForm.addEventListener('change', async (e) => {
        if (e.target.name === 'service') {
            addDisabled([fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn]);

            fieldspec.innerHTML = '<legend class="reserve__legend">Специалист</legend>';
            addPreload(fieldspec);

            const response = await fetch(`${API_URL}/api?service=${e.target.value}`);
            const data = await response.json();

            renderSpec(fieldspec, data);
            removePreload(fieldspec);
            removeDisabled([fieldspec]);
        }

        if (e.target.name === 'spec') {
            addDisabled([fielddata, fieldmonth, fieldday, fieldtime, btn]);
            addPreload(fieldmonth);

            const response = await fetch(`${API_URL}/api?spec=${e.target.value}`);
            const data = await response.json();

            fieldmonth.textContent = '';
            renderMonth(fieldmonth, data);
            removePreload(fieldmonth);
            removeDisabled([fielddata, fieldmonth]);
        }

        if (e.target.name === 'month') {
            addDisabled([fieldday, fieldtime, btn]);
            addPreload(fieldday);

            const response = await fetch(`
                ${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}`);
            const data = await response.json();

            fieldday.textContent = '';
            renderDay(fieldday, data, reserveForm.month.value);
            removePreload(fieldday);
            removeDisabled([fieldday]);
        }

        if (e.target.name === 'day') {
            addDisabled([fieldtime, btn]);
            addPreload(fieldtime);

            const response = await fetch(`
                ${API_URL}/api?spec=${reserveForm.spec.value}
                &month=${reserveForm.month.value}&day=${e.target.value}`);
            const data = await response.json();

            fieldtime.textContent = '';
            renderTime(fieldtime, data);
            removePreload(fieldtime);
            removeDisabled([fieldtime]);
        }

        if (e.target.name === 'time') {
            removeDisabled([btn]);
        }
    });
};

const init = () => {
    initSlider();
    initService();
    initReserve();
};

window.addEventListener('DOMContentLoaded', init);


