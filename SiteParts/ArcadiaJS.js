/*
    Copyright 2021 Drew Banyai
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

const Container = {
    create: (options) => {
        const containerType = (options && options.style && options.style.containerType) ? options.style.containerType : 'div'
        const container = document.createElement(containerType)

        Container.applyOptions(container, options)

        return container
    },

    applyOptions: (container, options) => {
        //  Generic options application
        if (!options) { return }
        if (options.id) { container.id = options.id }
        if (options.attributes) { for (const key in options.attributes) { container[key] = options.attributes[key] } }
        if (options.style) { for (const key in options.style) { container.style[key] = options.style[key] } }
        if (options.events) { for (const key in options.events) { container.addEventListener(key, options.events[key]) } }
    }
}

const Fontawesome = {
    create: (options) => {
        const container = Container.create({
            id: (options && options.id) ? options.id : 'Fontawesome',
            attributes: {
                className: (options && options.attributes && options.attributes.className) ? options.attributes.className : 'far fa-question-circle'
            },
            style: {
                containerType: 'i',
                userSelect: 'none'
            }
        })
        Container.applyOptions(container, options)

        container.setSymbol = (className) => { container.className = className }

        return container
    }
}

const Image = {
    create: (options) => {
        const container = document.createElement('img')
        container.setValue = (text) => Image.setValue(container, text)

        Container.applyOptions(container, options)
        if (container.value) Image.setValue(container, container.value)

        return container
    },
    getValue: (container) => { return container.src },
    setValue: (container, value) => { container.src = value }
}

const Label = {
    create: (options) => {
        if (!options.id) options.id = 'Label'
        const container = Container.create(options)

        container.setValue = (text) => { Label.setValue(container, text) }

        Container.applyOptions(container, options)
        if (options && options.attributes && options.attributes.value) container.setValue(options.attributes.value)

        return container
    },

    getValue (container) { return container.innerHTML },
    setValue (container, value) { container.innerHTML = value },
    setFont (container, font) { container.style.fontFamily = font },
    setFontSize (container, size) { container.style.fontSize = size },
    setColor (container, color) { container.style.color = color }
}

const TextInput = {
    create: (options) => {
        if (!options.id) options.id = 'TextInput'
        if (!options.style) options.style = {}
        options.style.containerType = 'input'
        const container = Container.create(options)

        container.callbacks = { return: null }
        const inputType = (options && options.type) ? options.type : 'text'
        container.setAttribute('type', inputType)
        container.addEventListener('keyup', (e) => { if ((e.code === 13) && (this.callbacks.return)) { this.callbacks.return() } })

        container.style.backgroundColor = 'white'
        container.style.color = 'black'

        return container
    },

    getValue: (container) => { return container.value },
    setValue (container, value) { container.value = value }
}

const BasicButton = {
    create: (options) => {
        if (!options.id) options.id = 'BasicButton'

        //  Create the main button, a rounded box
        const container = Container.create({
        id: options.id,
        style: {
            width: '200px',
            height: '26px',
            borderRadius: '6px',
            display: 'flex',
            border: '1px solid rgb(240, 240, 240)'
        }
        })
        Container.applyOptions(container, options)
        container.elements = { bgColor: null, textLabel: null }

        const bgColorNormal = 'rgb(15, 157, 88)'
        const bgColorHighlight = 'rgb(11, 115, 65)'
        const bgColorSelected = 'rgb(7, 75, 44)'

        //  Create the background color (to avoid border changing button size)
        container.elements.bgColor = Container.create({
        style: {
            width: '100%',
            height: '100%',
            lineHeight: '26px',
            borderRadius: '6px',
            display: 'flex',
            backgroundColor: bgColorNormal
        }
        })
        container.appendChild(container.elements.bgColor)

        //  Create a centered label on the button
        container.elements.textLabel = Label.create({
        attributes: { value: '' },
        style: {
            fontFamily: "'Titillium Web', sans-serif",
            margin: 'auto',
            cursor: 'default',
            userSelect: 'none',
            textAlign: 'center',
            color: 'rgb(220, 220, 220)'
        }
        })
        container.elements.bgColor.appendChild(container.elements.textLabel)
        container.elements.textLabel.setValue(container.value)

        //  Set mouse reactions
        container.onmouseover = () => { if (!container.disabled) { container.elements.bgColor.style.backgroundColor = bgColorHighlight } }
        container.onmouseout = () => { if (!container.disabled) { container.elements.bgColor.style.backgroundColor = bgColorNormal } }
        container.onmousedown = () => { if (!container.disabled) { container.elements.bgColor.style.backgroundColor = bgColorSelected } }
        container.onmouseup = () => { if (!container.disabled) { container.elements.bgColor.style.backgroundColor = bgColorHighlight } }

        return container
    },

    setValue: (container, text) => { container.elements.textLabel.setValue(text) },
    setFont: (container, font) => { container.elements.textLabel.setFont(font) },
    setFontSize: (container, size) => { container.elements.textLabel.setFontSize(size) },

    setOnClick: (container, callback) => { container.onclick = () => { if (container.disabled) { return } callback() } },

    setEnabled: (container, enabled) => { container.disabled = (!enabled) }
}

const FontawesomeButton = {
    create: (options) => {
        if (!options.id) options.id = 'FontawesomeButton'

        //  Create the main button, a rounded box
        const container = Container.create({
        id: options.id,
        style: {
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            display: 'flex',
            border: '1px solid rgb(240, 240, 240)'
        }
        })
        Container.applyOptions(container, options)
        container.elements = { bgColor: null, icon: null }

        const bgColorNormal = options.bgColorNormal ? options.bgColorNormal : 'rgb(15, 157, 88)'
        const bgColorHighlight = options.bgColorHighlight ? options.bgColorHighlight : 'rgb(11, 115, 65)'
        const bgColorSelected = options.bgColorSelected ? options.bgColorSelected : 'rgb(7, 75, 44)'

        //  Create the background color (to avoid border changing button size)
        container.elements.bgColor = Container.create({
        style: {
            width: '100%',
            height: '100%',
            lineHeight: '26px',
            borderRadius: '6px',
            display: 'flex',
            backgroundColor: bgColorNormal,
            cursor: container.style.cursor
        }
        })
        container.appendChild(container.elements.bgColor)

        //  Create a centered label on the button
        container.elements.icon = Fontawesome.create({
        attributes: { className: options.icon ? options.icon : 'fas fa-question' },
        style: {
            margin: 'auto',
            textAlign: 'center',
            color: 'rgb(220, 220, 220)',
            userSelect: 'none',
            cursor: container.style.cursor
        }
        })
        container.elements.bgColor.appendChild(container.elements.icon)

        //  Set mouse reactions
        container.onmouseover = () => { if (!container.disabled) { container.elements.bgColor.style.backgroundColor = bgColorHighlight } }
        container.onmouseout = () => { if (!container.disabled) { container.elements.bgColor.style.backgroundColor = bgColorNormal } }
        container.onmousedown = () => { if (!container.disabled) { container.elements.bgColor.style.backgroundColor = bgColorSelected } }
        container.onmouseup = () => { if (!container.disabled) { container.elements.bgColor.style.backgroundColor = bgColorHighlight } }

        return container
    },

    setFontSize: (container, size) => { container.elements.icon.setFontSize(size) },

    setOnClick: (container, callback) => { container.onclick = () => { if (container.disabled) { return } callback() } },

    setEnabled: (container, enabled) => { container.disabled = (!enabled) }
}