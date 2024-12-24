document.addEventListener('DOMContentLoaded', function () {
    class Button {
        constructor(id, name, type, container, position = { top: '50%', left: '50%' }, size = { width: 'calc(33.333% - 20px)', height: 'auto' }) {
            this.button = document.createElement('button');
            this.button.className = 'btn';
            this.button.id = id;
            this.name = name;
            this.type = type;
            this.position = position;
            this.size = size;

            this.container = container;
            this.setupButton();
        }

        setupButton() {
            Object.assign(this.button.style, {
                position: 'absolute',
                top: this.position.top,
                left: this.position.left,
                width: this.size.width,
            });
            this.button.textContent = this.name;
            this.button.addEventListener('click', this.handleClick.bind(this));
            this.container.appendChild(this.button);
        }

        handleClick() {
            switch (this.type) {
                case 'toggle':
                    this.toggleButton();
                    break;
                case 'tempBlue':
                    this.tempBlueButton();
                    break;
                case 'showImage':
                    this.showImageButton();
                    break;
            }
        }

        toggleButton() {
            this.button.classList.toggle('blue');
            this.button.classList.toggle('gray');
        }

        tempBlueButton() {
            this.button.classList.add('blue');
            setTimeout(() => this.button.classList.remove('blue'), 500);
        }

        showImageButton() {
            this.button.classList.add('blue');
            const imageContainer = document.getElementById('image-container');
            const img = document.createElement('img');
            img.src = '/asset/image.png';
            imageContainer.appendChild(img);
            imageContainer.style.display = 'block';

            setTimeout(() => this.button.classList.remove('blue'), 500);
            window.addEventListener('click', (event) => {
                if (!imageContainer.contains(event.target) && event.target !== this.button) {
                    imageContainer.style.display = 'none';
                }
            }, { once: true });
        }
    }

    class MutuallyExclusiveButtons {
        constructor(buttonIds, container) {
            this.buttons = buttonIds.map(id => document.getElementById(id));

            this.setupButtons();
        }

        setupButtons() {
            this.buttons.forEach(button => {
                button.addEventListener('click', this.handleClick.bind(this));
            });
        }

        handleClick(event) {
            this.buttons.forEach(button => {
                button.classList.remove('blue');
                button.classList.add('gray');
            });

            const clickedButton = event.currentTarget;
            clickedButton.classList.remove('gray');
            clickedButton.classList.add('blue');
        }
    }

    const buttonContainer = document.querySelector('.button-container');

    // 创建按钮实例
    new Button('btn1', '1', 'toggle', buttonContainer, { top: '20%', left: '30%' });
    new Button('btn2', '2', 'tempBlue', buttonContainer, { top: '40%', left: '30%' });

    const exclusiveButtons = ['btn3', 'btn4', 'btn5'];
    exclusiveButtons.forEach((id, index) => {
        new Button(id, id, 'gray', buttonContainer, {
            top: `${60 + index * 20}%`,
            left: '30%'
        });
    });

    new Button('btn6', '6', 'showImage', buttonContainer, { top: '60%', left: '60%' });

    // 初始化互斥按钮功能
    new MutuallyExclusiveButtons(exclusiveButtons, buttonContainer);
});
