document.addEventListener('DOMContentLoaded', function () {
    class Button {
        constructor(id, name, type, container, position = { top: '0%', left: '0%' }, size = { width: '20px', height: 'auto' }, buttongroup = null) {
            this.button = document.getElementById(id);
            this.button.className = 'btn';
            this.button.id = id;
            this.name = name;
            this.type = type;
            this.position = position;
            this.size = size;
            this.container = container;
            this.buttongroup = buttongroup;

            if (!this.container) {
                throw new Error('Container is not provided');
            }

            try {
                this.setupButton();
            } catch (error) {
                console.error(`Failed to setup button ${id}:`, error);
            }
        }

        // 按钮的创建、设置函数
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

        // 按钮点击事件的处理函数
        handleClick(event) {
            try {
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
                    case 'clusive':
                        this.clusiveButton(event);
                        break;
                    default:
                        console.warn(`Button type ${this.type} is not recognized.`);
                }
            } catch (error) {
                console.error(`Failed to handle click for button ${this.button.id}:`, error);
            }
        }

        // 普通点击按钮
        toggleButton() {
            this.button.classList.toggle('blue');
        }

        // 延时按钮
        tempBlueButton() {
            this.button.classList.add('blue');
            setTimeout(() => this.button.classList.remove('blue'), 500);
        }

        // 显示图片按钮
        showImageButton() {
            this.button.classList.add('blue');
            const imageContainer = document.getElementById('image-container');
            const img = new Image();
            if (!imageContainer) {
                throw new Error('Image container not found');
            }
            //判断是否已经有图片，如果没有则添加图片
            if(!imageContainer.querySelector('img')) {
                img.src = '/asset/image.png';
                imageContainer.appendChild(img);
            }
            imageContainer.style.display = 'block';
            setTimeout(() => this.button.classList.remove('blue'), 500);
            if(!imageContainer.hasClickListener){
                setTimeout(() => {
                    window.addEventListener('click', (event) => {
                        const timg = imageContainer.querySelector('img');
                        console.log('点击事件触发');
                        if (!imageContainer.contains(event.target) && event.target !== this.button) {
                            console.log('图片容器将被隐藏并移除图片');
                            imageContainer.style.display = 'none';
                            if (!timg == null) {
                                imageContainer.removeChild(timg); // 添加移除图片的逻辑
                            }
                            else{
                                console.log('图片已经被移除');
                            }
                        }
                    });
                }, 20);
                imageContainer.hasClickListener = true; // 设置标志变量
            }
        }

        // 互斥按钮
        clusiveButton(event) {
            if (!this.buttongroup) {
                console.warn('Button group is not provided for mutually exclusive buttons.');
                return;
            }

            this.buttongroup.forEach(buttonId => {
                const button = document.getElementById(buttonId);
                if (button) {
                    button.classList.remove('blue');
                    button.classList.add('white');
                }
            });

            const clickedButton = event.currentTarget;
            clickedButton.classList.remove('white');
            clickedButton.classList.add('blue');
        }
    }

    const buttonContainer = document.querySelector('.button-container');

    if (!buttonContainer) {
        console.error('Button container not found in the DOM.');
        return;
    }

    // 创建按钮实例
    const buttons = [
        { id: 'btn1', name: '1', type: 'toggle', position: { top: '20%', left: '30%' } },
        { id: 'btn2', name: '2', type: 'tempBlue', position: { top: '40%', left: '30%' } },
        { id: 'btn3', name: '3', type: 'clusive', position: { top: '60%', left: '30%' }, buttongroup: ['btn3', 'btn4', 'btn5'] },
        { id: 'btn4', name: '4', type: 'clusive', position: { top: '80%', left: '30%' }, buttongroup: ['btn3', 'btn4', 'btn5'] },
        { id: 'btn5', name: '5', type: 'clusive', position: { top: '100%', left: '30%' }, buttongroup: ['btn3', 'btn4', 'btn5'] },
        { id: 'btn6', name: '6', type: 'showImage', position: { top: '60%', left: '60%' } }
    ];
    buttons.forEach(buttonConfig => {
        new Button(
            buttonConfig.id,
            buttonConfig.name,
            buttonConfig.type,
            buttonContainer,
            buttonConfig.position,
            { width: '80px', height: 'auto' },
            buttonConfig.buttongroup
        );
    });
    
    function calculateScale() {
        // 获取页面尺寸
        var Width = window.innerWidth;
        var Height = window.innerHeight;

        // 假设您已经知道了图片的原始尺寸，或者您可以从其他地方获取它们
        var imageWidth = 2560; // 示例图片宽度
        var imageHeight = 1515; // 示例图片高度

        // 如果需要动态获取图片尺寸，可以使用之前提到的Image对象方法

        // 计算缩放比例
        var scaleX = Width / imageWidth;
        var scaleY = Height / imageHeight;
        var scale = Math.min(scaleX, scaleY); // 取较小的比例

        // 显示缩放比例
        document.getElementById('scaleOutput').textContent = '当前缩放比例: ' + scale.toFixed(2) +'页面宽' + Width + '高' + Height;
    }

    // 初始计算缩放比例
    calculateScale();

    // 添加窗口大小调整事件监听器以实时更新缩放比例
    window.addEventListener('resize', calculateScale);
});
