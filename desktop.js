/* ICON MANAGEMENT */

iconSelecting = icon => {
    icon.addEventListener('click', () => {
        document.querySelector('.desktop')
            .querySelectorAll('.desktop-icon[data-active="true"]')
            .forEach(el => el.dataset.active = false)

        icon.dataset.active = true
    })
    icon.addEventListener('dblclick', () => {
        openWindow({title: 'Sorry!'}, `
            <p>It doesn't work.</p>
        `)
    })
}


// clear selection on click
document.querySelector('.desktop')
    .addEventListener('click', e => {
        let assertNotIcon = target => {
            if (target === document.body) return true
            if (target.classList.contains('desktop-icon')) return false
            return assertNotIcon(target.parentNode)
        }

        if (!assertNotIcon(e.target)) return

        document.querySelector('.desktop')
            .querySelectorAll('.desktop-icon[data-active="true"]')
            .forEach(el => el.dataset.active = false)
    })

document.querySelector('.desktop')
    .querySelectorAll('.desktop-icon')
    .forEach(icon => {
        iconSelecting(icon)
    })
