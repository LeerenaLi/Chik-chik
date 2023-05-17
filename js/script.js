const addPreload = (elem) => {
    elem.classList.add('preload');
}

const removePreload = (elem) => {
    elem.classList.remove('preload');
}

const startSlider = () => {
    const sliderItems = document.querySelectorAll('.slider__item');
    console.log('sliderItems: ', sliderItems);
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
    }
    checkSlider();

    const prevSlide = () => {
        sliderItems[activeSlide]?.classList.remove('slider__item_active');

        position = -sliderItems[0].clientWidth * (activeSlide - 2);

        sliderList.style.transform = `translateX(${position}px)`;

        activeSlide -= 1;
        sliderItems[activeSlide]?.classList.add('slider__item_active');
        checkSlider();
    }

    const nextSlide = () => {
        sliderItems[activeSlide]?.classList.remove('slider__item_active');

        position = -sliderItems[0].clientWidth * activeSlide;

        sliderList.style.transform = `translateX(${position}px)`;

        activeSlide += 1;
        sliderItems[activeSlide]?.classList.add('slider__item_active');
        checkSlider();
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    window.addEventListener('resize', () => {
        if (activeSlide + 2 > sliderItems.length && document.documentElement.offsetWidth > 560) {
            activeSlide = sliderItems.length - 2;
            sliderItems[activeSlide]?.classList.add('slider__item_active');
        }

        position = -sliderItems[0].clientWidth * (activeSlide - 1);
        sliderList.style.transform = `translateX(${position}px)`;
        checkSlider();
    })
}

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
}

window.addEventListener('DOMContentLoaded', initSlider);




