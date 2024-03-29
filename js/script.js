window.addEventListener("DOMContentLoaded", () => {


    // Tabs
    const tabs = document.querySelectorAll(".tabheader__item");
    const tabsContent = document.querySelectorAll(".tabcontent");
    const tabsParent = document.querySelector(".tabheader__items");

    function hideTabContent() {
        tabsContent.forEach(item => {
            // item.style.display = "none";
            item.classList.add("hide");
            item.classList.remove("show");
        });

        tabs.forEach(item => {
            item.classList.remove("tabheader__item_active");
        });
    }

    function showTabContent(i = 0) {
        // tabsContent[i].style.display = "block";
        tabsContent[i].classList.add("show", "fade");
        tabsContent[i].classList.remove("hide");

        tabs[i].classList.add("tabheader__item_active");
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener("click", (e) => {
        const target = e.target;
        if (target && target.classList.contains("tabheader__item")) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });


    // Timer
    const deadline = "2024-03-20";

    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((t / (1000 * 60)) % 60);
            seconds = Math.floor((t / 1000) % 60);
        }

        return {
            "total": t,
            "days": days,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector("#days"),
            hours = timer.querySelector("#hours"),
            minutes = timer.querySelector("#minutes"),
            seconds = timer.querySelector("#seconds"),
            timeInterval = setInterval(updateClock, 1000);

        updateClock()

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock(".timer", deadline);


    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector(".modal")

    function openModal() {
        // modal.classList.toggle("show");
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = "hidden";
        clearInterval(modalTimerId);
    }

    function closeModal() {
        // modal.classList.toggle("show");
        modal.classList.remove('show');
        modal.classList.add('hide');
        document.body.style.overflow = "";
    }

    modalTrigger.forEach(item => {
        item.addEventListener('click', openModal);
    });


    modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.getAttribute("data-close") == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains("show")) {
            closeModal()
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);

    function showModalByScroll() {
        // pageYOffset - прокрученная часть, documentElement.clientHeight - высота видимой части
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener("scroll", showModalByScroll);
        }
    }

    window.addEventListener("scroll", showModalByScroll);


    
    // Cards

    class MenuCard {
        constructor(image, alt, title, desc, price, parentSelector, ...classes) {
            this.image = image;
            this.alt = alt;
            this.title = title;
            this.desc = desc;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 36;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement("div");
            
            if (this.classes.length === 0) {
                this.element = "menu__item";
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.image} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.desc}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `
            this.parent.append(element);
        }
    }

    const getResource = async (url) => {
        let res = await fetch(url);

        if(!res.ok){
            throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    // Используется вместо нескольких new MenuCard подряд как раньше
    // getResource("http://localhost:3000/menu")
    //     .then(data => {
    //         // используем деструктуризацию - ({...})
    //         data.forEach(({img, altimg, title, descr, price}) => {
    //             new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
    //         });
    //     });

    
    // Вариант создания карточек если не нужна шаблонизация
    getResource("http://localhost:3000/menu")
        .then(data => createCard(data));

    function createCard(data) {
        data.forEach(({img, altimg, title, descr, price}) => {
            const element = document.createElement("div");

            element.classList.add("menu__item");

            element.innerHTML = `
                <img src=${img} alt=${altimg}>
                <h3 class="menu__item-subtitle">${title}</h3>
                <div class="menu__item-descr">${descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${price}</span> грн/день</div>
                </div>
            `;

            document.querySelector(".menu .container").append(element);
        });

    }


    //Forms
    const forms = document.querySelectorAll('form');

    const message = {
        loading: "img/spinner.svg",
        success: "Спасибо! Скоро мы с вами свяжемся",
        failure: "Что-то пошло не так..."
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    // Настройка, отправка запроса на сервер, трансофрмирует полученный ответ от сервера в json
    // Асинхронный код (выполняется сначала fetch (возвращает promise) и только потом присвоиться в переменную) по этому используем async/await
    const postData = async (url, data) => {
        let res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            // body: formData в случае отправки formData
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement("img");
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            // statusMessage.classList.add("status");
            // statusMessage.textContent = message.loading;
            // form.append(statusMessage);

            // Добавление элемента после формы, а не просто в её конец
            form.insertAdjacentElement("afterend", statusMessage);

            

            // Отправка данных с формы 
            const formData = new FormData(form);

            // FormData to JSON
            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            // const obj = {a: 23, b: 50};
            // console.log(Object.entries(obj));

            postData("http://localhost:3000/requests", json)
            // .then(data => data.text()) - не нужен, так как трансформация происходит на этапе postData
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector(".modal__dialog");

        prevModalDialog.classList.add("hide");
        openModal();

        const thanksModal = document.createElement("div");
        thanksModal.classList.add("modal__dialog");
        thanksModal.innerHTML = `
            <div class = "modal__content">
                <div class = "modal__close" data-close>×</div>
                <div class = "modal__title">${message}</div>
            </div>
        `;
        document.querySelector(".modal").append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add("show");
            prevModalDialog.classList.remove("hide");
            closeModal();
        }, 4000);
    }

    // API
    // fetch('https://jsonplaceholder.typicode.com/todos/1')
    //   .then(response => response.json())
    //   .then(json => console.log(json))

    // fetch('https://jsonplaceholder.typicode.com/posts', {
    //     method: "POST",
    //     body: JSON.stringify({name: "Alex"}),
    //     headers: {
    //         "Content-type": "application/json"
    //     }
    // })
    // .then(response => response.json())
    // .then(json => console.log(json));


    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));
});