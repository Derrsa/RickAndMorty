let url = 'https://rickandmortyapi.com/api/character/?page=1'
let urlPage = 'https://rickandmortyapi.com/api/character/?page=1'
let cardWrapper = document.querySelector('.wrapper-card')
let isLoading = false
let shouldLoad = true
let paginationBtn = document.querySelector('.changer')
let upBtn = document.querySelector('.top__btn')
let paginationTrue = false





// Create pagination
function createPagination(pages){
    let listPag = document.createElement('ul')
    listPag.classList.add('page-list')
    document.querySelector('.wrapper').append(listPag)
    for(let i = 1;i<=pages; i++){
        let li = document.createElement('li')
        li.classList.add('page-item')
        li.innerHTML = `<a class="page-link" data-link='https://rickandmortyapi.com/api/character/?page=${i}' href="#">${i}</a>`
        listPag.append(li)
    }
    let paginationLink = document.querySelectorAll('.page-link')
    paginationLink.forEach(page => {

        page.addEventListener('click',el=>{
            paginationLink.forEach(anotherEl=>{
                if(anotherEl.classList.contains('page-item-active')){
                    anotherEl.classList.remove('page-item-active')
                }
            })
            el.currentTarget.classList.add('page-item-active')
            url = el.currentTarget.getAttribute("data-link")
            fetchCard()
            el.preventDefault()
        })
    })
}

// Add listener to pagination button
paginationBtn.addEventListener('click', ()=>{
    paginationTrue = !paginationTrue
    if(paginationTrue){
        paginationBtn.innerHTML = 'Scrolling'
        fetchCard()
    }
    if(!paginationTrue){
        paginationBtn.innerHTML = 'Pagination'
        fetchCard()
    }
})




// Thottle window listener
;(() => {
    window.addEventListener('scroll', throttle(checkPosition, 250))
    window.addEventListener('resize', throttle(checkPosition, 250))
})();

function throttle(callee, timeout) {
    let timer = null
    return function perform(...args) {
        if (timer) return

        timer = setTimeout(() => {
            callee(...args)

            clearTimeout(timer)
            timer = null
        }, timeout)
    }
}


// Find window and body size and user scroll distance
async function checkPosition(){
    if (!paginationTrue) {
        const height = document.body.offsetHeight
        const screenHeight = window.innerHeight
        const scrolled = window.scrollY
        const criticalPoint = height - screenHeight * 1.5
        if (scrolled >= criticalPoint) {
            fetchCard(urlPage)
        }
    }
}





// Create and append card to DOM

function appendCard(cardData){
    const cardNode = composeCard(cardData)
    cardWrapper.append(cardNode)
    hideMask()
}

function composeCard(cardData){
    if(!cardData) return
    const template = document.getElementsByTagName('template')[0]
    const card = template.content.cloneNode(true)
    const title = cardData.name
    const image = cardData.image
    const idChar = cardData.id
    card.querySelector('.card').addEventListener('click',(el)=>{
        paginationBtn.style.display = 'none'
        upBtn.style.display = 'none'
        document.body.style.overflow = 'hidden'
        composeModal(cardData)
        appendModal(cardData)
    })
    card.querySelector('.card').setAttribute('data-id',idChar)
    card.querySelector('h2').innerText = title
    card.querySelector('img').setAttribute('src', image)

    return card

}

// Hide preloader
function hideMask() {
    document.querySelectorAll('img').forEach(img=>{

        img.onload = ()=>{
            let el = img.closest('.card')
            el.querySelector('.mask').classList.add('mask-hide')
        }
    })

}

// Delete current card list
function deleteCard(){
    document.querySelectorAll('.card').forEach(el=>{
        cardWrapper.removeChild(el)
    })
}

//Create and append modal
function appendModal(cardData){
    const modalNode = composeModal(cardData)
    cardWrapper.append(modalNode)

}


function composeModal(cardData){
    if(!cardData) return
    const template = document.getElementsByTagName('template')[1]
    const modal = template.content.cloneNode(true)
    const name = cardData.name
    const origin = cardData.origin.name
    const status = cardData.status
    const location = cardData.location.name
    const species = cardData.species
    const gender = cardData.gender
    const image = cardData.image


    modal.querySelector('.card-modal-name span').innerText = name
    modal.querySelector('.card-modal-origin span').innerText = origin
    modal.querySelector('.card-modal-status span').innerText = status
    modal.querySelector('.card-modal-species span').innerText = species
    modal.querySelector('.card-modal-location span').innerText = location
    modal.querySelector('.card-modal-gender span').innerText = gender
    modal.querySelector('.card-modal-close').addEventListener('click',(el)=>{
        paginationBtn.style.display = 'block'
        upBtn.style.display = 'block'
        document.querySelector('.card-modal-backdrop').remove()
        document.body.style.overflow = 'auto'
    })
    modal.querySelector('.card-modal-backdrop').addEventListener('click',(el)=>{
        if(el.target === document.querySelector('.card-modal-backdrop')){
            paginationBtn.style.display = 'block'
            upBtn.style.display = 'block'
            document.querySelector('.card-modal-backdrop').remove()
            document.body.style.overflow = 'auto'
        }

    })
    modal.querySelector('img').setAttribute('src', image)
    return modal
}

//Create card list
async function fetchCard() {
    if(!paginationTrue){
        if (isLoading||!shouldLoad) return
        isLoading = true

        let list = await fetch(urlPage)
        let resp = await list.json()
        let charList = resp.results
        urlPage = resp.info.next

        charList.forEach(el => appendCard(el))


        if(!urlPage) shouldLoad = false
        isLoading = false
    } else if(paginationTrue) {
        if (isLoading||!shouldLoad) return
        isLoading = true
        let list = await fetch(url)
        let resp = await list.json()
        let charList = resp.results
        let totalPage = resp.info.pages

        deleteCard()
        charList.forEach(el => appendCard(el))
        if(!document.querySelector('.page-list')){
            createPagination(totalPage)
        }
        if(!urlPage) shouldLoad = false
        isLoading = false
    }

}

fetchCard(urlPage)



// let temp = document.getElementsByTagName('template')[0]
// let card = temp.content.cloneNode(true)
// app.append(card)


