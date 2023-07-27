const btn = document.querySelector('.compliment-btn');
const addForm = document.querySelector('form');
const nameInput = document.querySelector('input');
const container = document.querySelector('section');

function putTheThingInTheView(res) {
    container.innerHTML = ''
    nameInput.value = ''

    res.data.forEach((color, index) => {
        container.innerHTML += `<p name=${index}>${color}</p>`
    })

    document.querySelectorAll('p').forEach(element => {
        const theIndexValue = element.getAttribute('name');

        element.addEventListener('click', () => {
            axios
                .delete(`/api/colors/${theIndexValue}`)
                .then(res => {
                    putTheThingInTheView(res)
                })
        })
    })
}

function submitHandler(evt) {
    evt.preventDefault();

    axios
        .post('/api/colors', { name: nameInput.value })
        .then(res => {
            putTheThingInTheView(res)
        })
        .catch(err => {
            nameInput.value = ''

            const notif = document.createElement('aside')
            notif.innerHTML = `<p>${err.response.data}</p>
            <button class="close">close</button>`
            document.body.appendChild(notif)

            document.querySelectorAll('.close').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.target.parentNode.remove()
                })
            })
        })
}

axios
    .get('/api/colors')
    .then(res => {
        putTheThingInTheView(res)
    })

addForm.addEventListener('submit', submitHandler)

const clickHandler = () => alert('You are so beautiful')

btn.addEventListener('click', clickHandler)