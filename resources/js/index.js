let ID = () => Math.random().toString(36).substr(2, 9);

let createAccordianItem = (id, title, isFirst) => {
    return `
    <div class="accordion-item" id="card${id}">
        <h2 class="accordion-header" id="heading${id}">
            <button class="accordion-button ${isFirst ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${id}" aria-expanded="${isFirst}" aria-controls="collapse${id}">
                ${title}
            </button>
        </h2>
        <div id="collapse${id}" class="accordion-collapse collapse ${isFirst ? 'show' : ''}" aria-labelledby="heading${id}" data-bs-parent="#accordionExample">
        </div>
    </div>
    `;
};

let outerCarousel = (id, innerId) => {
    return `  
        <div id="carouselExample${id}" class="carousel slide position-relative">
            <div class="px-3" id="smooth">
                <div class="carousel-inner" id="${innerId}">
                </div>
            </div>
            <div class="carousel-controls-outside">
                <div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample${id}" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                </div>
                <div>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExample${id}" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </div>
    `;
};

let createInnerCarousel = (id, active) => {
    return `<div class="carousel-item ${active ? 'active' : ''}" id="${id}">
        </div>`;
};

let createCard = (item) => {
    const { title, author, pubDate, description, enclosure,link } = item;
    const { link: imageLink } = enclosure;

    return `
        <div class="card d-block">
         <a href="${link}" >  <img class="card-img-top w-100" src="${imageLink}" /> </a> 
            <div class="card-body">
                <div class="accordion-text">
                    <h3>${title}</h3>
                    <div class="d-flex">
                        <span class="author-design me-2">${author}</span>
                        <span class="name-date ms-2">${pubDate}</span>
                    </div>
                    <div class="carousel-text">
                        <p>${description}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
};

let initialFunction = async () => {
    try {
        for (let i = 0; i < magazines.length; i++) {
            const url = magazines[i];
            const fetchUrl = `https://api.rss2json.com/v1/api.json?rss_url=${url}`;
            const response = await fetch(fetchUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(data);
            
            // select dom
            const accordionElement = document.getElementById("accordionExample");

            // create Accordion
            const accordionId = ID();
            const AccordianTitle = data.feed.title;
            const isFirst = i === 0; // Open only the first accordion item
            const accordionItemString = createAccordianItem(accordionId, AccordianTitle, isFirst);
            accordionElement.innerHTML += accordionItemString;

            // create Outer Carousel
            const carouselId = ID();
            const outerInnerCarouselId = ID();
            const outerCarouselElement = outerCarousel(carouselId, outerInnerCarouselId);

            const accordionItemElement = document.getElementById(`collapse${accordionId}`);
            accordionItemElement.innerHTML += outerCarouselElement;

            // add card inside Carousel
            const items = data.items;
            
            for (let index in items) {
                let cardElement = createCard(items[index]);
                
                // create inner carousel
                const innerCarouselID = ID();
                const innerCarouselElement = createInnerCarousel(innerCarouselID, index == 0);

                // Take the Inner Carousel item to the Outer One
                const outerCarouselElement = document.getElementById(outerInnerCarouselId);
                outerCarouselElement.innerHTML += innerCarouselElement;

                // select carousel inner for adding a card
                const innerCarouselElementCard = document.getElementById(`${innerCarouselID}`);
                innerCarouselElementCard.innerHTML += cardElement;
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

initialFunction();
